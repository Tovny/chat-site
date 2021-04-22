const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const cors = require("cors");
const admin = require("firebase-admin");
const firebaseConfig = require("./config");

const joinRoomHandler = require("./handlers/join-room-handler");
const userChangeHandler = require("./handlers/user-change-handler");
const roomChangeHandler = require("./handlers/room-change-handler");
const messageHandler = require("./handlers/message-handler");
const emailRegistrationHandler = require("./handlers/email-registration-handler");
const loginHandler = require("./handlers/login-handler");
const logoutHandler = require("./handlers/logout-handler");
const {
  createRoomHandler,
  joinNewRoomHandler,
} = require("./handlers/room-creation-handlers");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});
const firestore = admin.firestore();

wss.on("connection", (ws) => {
  ws.isAlive = true;

  const keepAliveInterval = setInterval(() => {
    if (!ws.isAlive) return ws.close();
    ws.isAlive = false;
    ws.ping();
  }, 1000 * 60);

  ws.on("pong", () => {
    ws.isAlive = true;
  });

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

    if (!ws.room) ws.room = "Global Chat";

    ws.isAlive = true;

    switch (type) {
      case "ping":
        ws.username = user.username;
        ws.uid = user.uid;
        ws.avatar = user.avatar;
        ws.room = room;
        break;
      case "reconnect":
        ws.username = user.username;
        ws.uid = user.uid;
        ws.avatar = user.avatar;
        ws.room = room;
        joinRoomHandler(wss, ws, room, firestore);
      case "join":
        joinRoomHandler(wss, ws, room, firestore);
        break;
      case "userChange":
        userChangeHandler(wss, ws, oldUser, newUser);
        break;
      case "roomChange":
        roomChangeHandler(wss, ws, newRoom);
        break;
      case "message":
        messageHandler(wss, ws, admin, firestore, payload, user, room);
        break;
      case "newEmailUser":
        emailRegistrationHandler(wss, ws, admin, firestore, payload);
        break;
      case "login":
        loginHandler(wss, ws, firestore, payload, user);
        break;
      case "logout":
        logoutHandler(wss, ws);
        break;
      case "createRoom":
        createRoomHandler(wss, ws, admin, firestore, newRoom, user);
        break;
      case "joinRoom":
        joinNewRoomHandler(wss, ws, firestore, newRoom, user);
        break;
      default:
        return;
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
        if (client.readyState === WebSocket.OPEN)
          client.send(JSON.stringify({ type: "userLeft", payload: ws.uid }));
      });

    clearInterval(keepAliveInterval);

    ws.close();
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(PORT);
