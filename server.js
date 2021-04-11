const express = require("express");
const http = require("http");
const WebSocket = require("ws");
var admin = require("firebase-admin");
var serviceAccount = require("./fireAdmin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const firestore = admin.firestore();

const server = http.createServer(app);

const wss = new WebSocket.Server({ port: 5000 });

(async () => {
  wss.on("connection", async (ws) => {
    ws.on("message", async (msg) => {
      const {
        type,
        user,
        room,
        payload,
        oldUser,
        newUser,
        oldRoom,
        newRoom,
      } = JSON.parse(msg);

      if (!room || !ws.room) ws.room = "global-messages";

      if (type === "join") {
        const fireMessages = await firestore
          .collection(room) // change to room
          .orderBy("time", "asc")
          .limitToLast(25)
          .get();

        const messages = new Array();

        fireMessages.forEach((doc) => {
          // GET ALL MESSAGE DATA AND ATTACH THE ID
          const message = doc.data();
          message.id = doc.id;

          messages.push(message);
        });

        ws.send(JSON.stringify({ type: "message", payload: messages }));

        const activeUsers = new Array();
        const done = new Array();

        wss.clients.forEach((client) => {
          if (!done.includes(client.uid) && client.room === ws.room) {
            activeUsers.push({
              username: client.username,
              avatar: client.avatar,
              uid: client.uid,
            });

            done.push(client.uid);
          }
        });

        ws.send(
          JSON.stringify({
            type: "newUser",
            payload: activeUsers,
          })
        );
      }

      if (type === "userChange") {
        let otherSockets = false;

        if (!newUser) return;

        if (!oldUser) {
          wss.clients.forEach((client) => {
            if (client.room === ws.room)
              client.send(
                JSON.stringify({ type: "newUser", payload: [newUser] })
              );
          });
        } else {
          wss.clients.forEach((client) => {
            if (client.uid === ws.uid && client !== ws) otherSockets = true;
            if (client.room === ws.room)
              client.send(
                JSON.stringify({
                  type: "newUser",
                  payload: [newUser],
                })
              );
          });

          if (!otherSockets) {
            wss.clients.forEach((client) => {
              client.send(
                JSON.stringify({ type: "userLeft", payload: oldUser.uid })
              );
            });
          }
        }

        ws.username = newUser.username;
        ws.uid = newUser.uid;
        ws.avatar = newUser.avatar;
      }

      if (type === "roomChange") {
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({ type: "userLeft", payload: ws.uid }));
          if (client.room === newRoom)
            client.send(
              JSON.stringify({
                type: "newUser",
                payload: [
                  { username: ws.username, uid: ws.uid, avatar: ws.avatar },
                ],
              })
            );
        });

        ws.room = newRoom;
      }

      if (type === "message") {
        const message = {
          msg: payload.msg,
          username: user.username,
          uid: user.uid,
          avatar: user.avatar,
          time: admin.firestore.Timestamp.now(),
        };

        const res = await firestore.collection(room).add(message);

        message.id = res.id;

        wss.clients.forEach((client) => {
          if (client.room === ws.room)
            client.send(
              JSON.stringify({
                type: "message",
                payload: [message],
              })
            );
        });
      }

      if (type === "login") {
        let doc = (
          await firestore.collection("users").doc(payload).get()
        ).data();

        if (!doc) {
          const newUser = {
            username: user.displayName,
            avatar: user.photoURL,
            uid: user.uid,
            rooms: [],
          };

          await firestore.collection("users").doc(user.uid).set(newUser);

          doc = (await firestore.collection("users").doc(payload).get()).data();
        }

        ws.send(JSON.stringify({ payload: doc, type: "login" }));
      }

      if (type === "logout") {
        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              type: "newUser",
              payload: [
                { username: ws.username, avatar: ws.avatar, uid: ws.uid },
              ],
            })
          );
        });
      }
    });

    ws.on("error", (err) => ws.send(err));

    ws.on("close", () => {
      let otherSockets = false;

      wss.clients.forEach((client) => {
        if (client.uid === ws.uid && client !== ws) otherSockets = true;
      });

      if (!otherSockets)
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({ type: "userLeft", payload: ws.uid }));
        });
    });
  });
})();
