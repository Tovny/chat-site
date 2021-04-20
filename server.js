const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const cors = require("cors");
const admin = require("firebase-admin");
const firebaseConfig = {
  type: "service_account",
  project_id: "chat-pwa-fd1fb",
  private_key_id: "a2a6a5871292703ef06ffa4334e6183ccc4b4ab6",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDReKwfCWMBVVRp\nd3hW+1suOqZfeA4cqJFT3dIMrVYQV+vEGR9h1LNzWgVe7iwpg6i8tTM9NtJ61Ewn\nopROBG5cYTR2WnhA+7iCcBAuEvA+31WOGAW35shWfQcf4xqXaBtizi8eR1D50BQx\nSG85/D3KfppmKbpg3ptT/a3Bw1XErBYkvkB1sOPoi7prrChJekxShaeaEwGluJ/I\nT55V/12aRmxasBX2R95UQs8DW6Q3KbIWg6jCSoCLnQAW0Z0gU2CFqNVFaBkFcx1r\nm1T1IiU3gDaiSfBtnutL3+Fwp4/QOYrTWSIQ2nHY9tND8THsRVvFzxg0BROrvPK6\nzp51I9xzAgMBAAECggEABV0pf/ko9hDHgsffZs+a8lOBwFh+Emr/bBfDC2lCfSEM\n1YGuYj5X6T1F4+9sMnsmAZpDDKJwJo5AwPpFzlWiUDutym+r1dlcTGLIPa9lQ+1K\n7vX1USDX9ao2WeR74TxDCN2uXgBStelUV9eHmZy4jFkZMdwhr929BoKTEq7vOrdn\nHddFxbKrPPIIArNYewD8hlThMcHHe8v8fpa9X9G4ixv+lREYi3fb4cw9Oy7XoBRW\nTtBK3+pShh7VYrPJeGJUUdLK168i9VNzmu4PoQpwTP/QgsONlBcWAwpDFfZ6jZGy\ndxfodZGFYk4zz4MNLIKNnYM/f2Fyq6NFHhoqn6e6eQKBgQDzejcMvsgVsooqCkjS\ntG05KZFTccyCqej+mpxw0rgQjo74eDc0p/pZYTT2jAUKoYVb5PO5RgJgFm4zHASK\nbrXAPeTg1wqehDaL/Hdb7YmsWkazmZhhlRvUcVZ7LrKAPY0ZCiYXgwiNJRCxUTFA\nm1Fo9/BApOehqTYa3PF+bTx/jQKBgQDcPrYfZmuyyALSUgx6eaTWPwrLaTPJtBrC\nUKCafy0CDOKrdmXXPlDKl7EnuY/VVTaBtO71CXJgJ1x00Z5GzrDUs6iEa93aeem3\na6cDwNXNy4rcu72OiLi1U/s1eFwpxdRQeMBlZdNlQ1qROileRPGMth/6FzkzXLCG\ncVSzYqzL/wKBgD/FGdgHvAYazh82tF4jjZv0LDEL1EHA2Nqeiizus/D6Na4UZnkv\nKd3xHNsaT1O6fGBWNhOnp4WdOl2+j93mI0pnq6PMDub3wAWoKWb1byKqPmxZ5VRh\npnlc+ganc28tL+CIDPQJiNrXA2k918WRKKBymAWGa3inBhnBFqtDVx4dAoGAdBpK\n/7qKQ7DUa/L8yQOfNaH+GsTWnBnpkU3XnBo2q8IHK8Q6Y4FiLapRpVNY02kcVrv+\nzAWy2aVmQ97MxR7ocPhUeZozVZy27A4/+OaKzvXhugLuJllEpbIj10gfrZWwGsvN\nAKbxDYy4DZ7Pd/Z4L2lC6h+b88uE8xqDQB1gYhkCgYEAtvwbovpZnRaiqY5v1AX7\nG0usJ84rVRx/wXlxeV3sZw4bnkyBP6SMuRSL/68nmmIFXgUgZ2h2uLxYklBHhdS4\nlrCz6x3uJVyxpVr2Wg3YmQiYs9gPEwxZBMKGVccDwKSNYc75ol0+HHqpErZGyYiI\n5LSfg1aWnZnAcELIGglG9Gc=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-qfgph@chat-pwa-fd1fb.iam.gserviceaccount.com",
  client_id: "100409785012692514291",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qfgph%40chat-pwa-fd1fb.iam.gserviceaccount.com",
};

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
    if (!ws.isAlive) return ws.terminate();
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

    switch (type) {
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
