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

      if (!ws.room) ws.room = "global-messages";

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
        let otherSockets = false;

        wss.clients.forEach((client) => {
          if (client.uid === ws.uid && client !== ws) otherSockets = true;
        });

        if (!otherSockets)
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

      if (type === "newEmailUser") {
        if (!payload.username) {
          ws.send(
            JSON.stringify({
              type: "registrationError",
              payload: { type: Error, message: "Please enter a username." },
            })
          );
        } else {
          const users = await firestore.collection("users").get();
          const usernames = new Array();

          users.forEach((user) => {
            const data = user.data();
            usernames.push(data.username);
          });

          if (usernames.includes(payload.username)) {
            ws.send(
              JSON.stringify({
                type: "registrationError",
                payload: { type: Error, message: "Username taken." },
              })
            );
          } else {
            try {
              const res = await admin.auth().createUser({
                email: payload.email,
                password: payload.password,
                displayName: payload.username,
              });

              await firestore.collection("users").doc(res.uid).set(
                {
                  username: payload.username,
                  avatar: payload.avatar,
                  uid: res.uid,
                  rooms: [],
                },
                { merge: true }
              );

              const token = await admin.auth().createCustomToken(res.uid);

              ws.send(
                JSON.stringify({
                  payload: token,
                  type: "registrationSuccess",
                })
              );
            } catch (err) {
              ws.send(
                JSON.stringify({ type: "registrationError", payload: err })
              );
            }
          }
        }
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

      if (type === "createRoom") {
        try {
          const collections = await firestore.listCollections();

          const rooms = collections.map((collection) =>
            collection["_queryOptions"]["collectionId"].toUpperCase()
          );

          if (!rooms.includes(newRoom.toUpperCase())) {
            const newPost = {
              username: "Chat Bot",
              msg: `${user.username} created ${newRoom}`,
              time: admin.firestore.Timestamp.now(),
              avatar:
                "https://cdn.iconscout.com/icon/premium/png-256-thumb/system-1750733-1488785.png",
            };

            await firestore.collection(newRoom).add(newPost);

            const doc = await firestore.collection("users").doc(user.uid).get();

            const dbUser = doc.data();

            dbUser.rooms.push(newRoom);

            await firestore
              .collection("users")
              .doc(user.uid)
              .set({ rooms: dbUser.rooms }, { merge: true });

            const newo = await firestore
              .collection("users")
              .doc(user.uid)
              .get();
            const doco = newo.data();

            ws.send(JSON.stringify({ payload: doco, type: "login" }));
          } else {
            ws.send(
              JSON.stringify({
                type: "createRoomError",
                payload: { type: Error, message: "Room already exists." },
              })
            );
          }
        } catch (err) {
          ws.send(
            JSON.stringify({
              type: "createRoomError",
              payload: err,
            })
          );
        }
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
