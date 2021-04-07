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
      const { type, user, room, token, payload } = JSON.parse(msg);

      if (user !== ws.username) {
        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({ type: "userLeft", payload: ws.username })
          );
        });

        ws.username = user.username;
      }

      if (type === "join") {
        ws.activeRoom = room;

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

        wss.clients.forEach((client) => {
          if (client.activeRoom === ws.activeRoom && client !== ws) {
            client.send(
              JSON.stringify({
                type: "newUser",
                payload: ws.username,
              })
            );

            ws.send(
              JSON.stringify({
                type: "newUser",
                payload: client.username,
              })
            );
          }
        });
      }

      if (type === "leave") {
        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({ type: "userLeft", payload: ws.username })
          );
        });
      }

      let message;

      if (type === "message") {
        message = {
          msg: payload.msg,
          username: user.username,
          uid: user.uid,
          avatar: user.avatar,
          time: admin.firestore.Timestamp.now(),
        };
      }

      if (token) {
        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          const uId = decodedToken.uid;

          if (type === "message") {
            const res = await firestore
              .collection("global-messages")
              .add(message);

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

          if (type === "deleteMessage") {
            console.log("tu?");
            console.log(payload);
            firestore.collection("global-messages").doc(payload).delete();
            wss.clients.forEach((client) => {
              client.send(
                JSON.stringify({
                  type: "deleteMessage",
                  payload,
                })
              );
            });
          }

          if (type === "deleteMessage") {
            firestore.collection("global-messages").doc(payload.id).delete();
            wss.clients.forEach((client) => {
              client.send(
                JSON.stringify({
                  type: "deleteMessage",
                  payload,
                })
              );
            });
          }

          if (type === "login") {
            const doc = (
              await firestore.collection("users").doc(decodedToken.uid).get()
            ).data();

            doc.uId = decodedToken.uid;

            ws.send(JSON.stringify({ payload: doc, type: "login" }));
          }

          if (type === "changeUser") {
            firestore.collection("users").doc(uId).set(
              {
                nickname: decodedToken.name,
                picture: decodedToken.picture,
              },
              { merge: true }
            );

            const doc = (
              await firestore.collection("users").doc(decodedToken.uid).get()
            ).data();

            doc.uId = decodedToken.uid;

            ws.send(JSON.stringify({ payload: doc, type: "login" }));
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        if (type === "message") {
          const res = await firestore
            .collection("global-messages")
            .add(message);

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
      }
    });

    ws.on("error", (err) => ws.send(err));

    ws.on("close", () => {
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: "userLeft", payload: ws.username }));
      });
    });
  });
})();

//server.listen(3000, () => console.log("server live"));
