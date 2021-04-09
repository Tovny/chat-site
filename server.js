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
      const { type, user, room, payload } = JSON.parse(msg);

      ws.avatar = user.avatar;

      if (user.username !== ws.username || user.uid !== ws.uid) {
        let otherSockets = false;

        wss.clients.forEach((client) => {
          if (client.uid === ws.uid && client !== ws) otherSockets = true;
        });

        if (!otherSockets)
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({ type: "userLeft", payload: ws.uid }));
          });

        ws.username = user.username;
        ws.uid = user.uid;
      }

      if (type === "join") {
        ws.activeRoom = "global";

        const fireMessages = await firestore
          .collection("global-messages") // change to room
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
          if (client.activeRoom === ws.activeRoom && client !== ws) {
            client.send(
              JSON.stringify({
                type: "newUser",
                payload: [
                  { username: ws.username, avatar: ws.avatar, uid: ws.uid },
                ],
              })
            );
          }
          if (!done.includes(client.uid)) {
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

      if (type === "leave") {
        let otherSockets = false;

        wss.clients.forEach((client) => {
          if (client.uid === ws.uid && client !== ws) otherSockets = true;
        });

        if (!otherSockets)
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({ type: "userLeft", payload: ws.uid }));
          });
      }

      if (type === "message") {
        const message = {
          msg: payload.msg,
          username: user.username,
          uid: user.uid,
          avatar: user.avatar,
          time: admin.firestore.Timestamp.now(),
        };

        const res = await firestore.collection("global-messages").add(message);

        message.id = res.id;

        wss.clients.forEach((client) => {
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
            rooms: ["global"],
          };

          await firestore.collection("users").doc(user.uid).set(newUser);

          doc = (await firestore.collection("users").doc(payload).get()).data();
        }

        ws.send(JSON.stringify({ payload: doc, type: "login" }));

        ws.username = doc.username;
        ws.avatar = doc.avatar;
        ws.uid = doc.uid;

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
