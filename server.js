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
        if (
          !done.includes(client.uid) &&
          client.room === ws.room &&
          client.readyState === WebSocket.OPEN
        ) {
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
          if (client.room === ws.room && client.readyState === WebSocket.OPEN)
            client.send(
              JSON.stringify({ type: "newUser", payload: [newUser] })
            );
        });
      } else {
        wss.clients.forEach((client) => {
          if (client.uid === ws.uid && client !== ws) otherSockets = true;
          if (client.room === ws.room && client.readyState === WebSocket.OPEN)
            client.send(
              JSON.stringify({
                type: "newUser",
                payload: [newUser],
              })
            );
        });

        if (!otherSockets) {
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN)
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
          if (client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify({ type: "userLeft", payload: ws.uid }));
          if (client.room === newRoom && client.readyState === WebSocket.OPEN)
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
        if (client.room === ws.room && client.readyState === WebSocket.OPEN)
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
        const { users } = await admin.auth().listUsers();
        const usernames = new Array();

        users.forEach((user) => {
          usernames.push(user.displayName.toUpperCase());
        });

        if (usernames.includes(payload.username.toUpperCase())) {
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
              photoURL: payload.avatar,
            });

            await firestore.collection("users").doc(res.uid).set(
              {
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
      let doc = (await firestore.collection("users").doc(payload).get()).data();

      if (!doc) {
        const newUser = {
          rooms: [],
        };

        await firestore.collection("users").doc(user.uid).set(newUser);

        doc = (await firestore.collection("users").doc(payload).get()).data();
      }

      ws.send(JSON.stringify({ payload: doc, type: "login" }));
    }

    if (type === "logout") {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN)
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

    const getRooms = async (upperCase = false) => {
      const collections = await firestore.listCollections();

      let rooms;
      if (upperCase) {
        rooms = collections.map((collection) =>
          collection["_queryOptions"]["collectionId"].toUpperCase()
        );
      } else {
        rooms = collections.map(
          (collection) => collection["_queryOptions"]["collectionId"]
        );
      }

      return rooms;
    };

    const addUserToRoom = async (addRoom = newRoom) => {
      const doc = await firestore.collection("users").doc(user.uid).get();

      const dbUser = doc.data();

      const subscribedRooms = new Array();

      dbUser.rooms.forEach((room) => subscribedRooms.push(room.toUpperCase()));

      if (
        !subscribedRooms.includes(addRoom.toUpperCase()) &&
        addRoom.toUpperCase() !== "GLOBAL CHAT"
      ) {
        dbUser.rooms.push(addRoom);

        await firestore
          .collection("users")
          .doc(user.uid)
          .set({ rooms: dbUser.rooms }, { merge: true });

        const updatedUser = await firestore
          .collection("users")
          .doc(user.uid)
          .get();
        const updatedUserData = updatedUser.data();

        ws.send(JSON.stringify({ payload: updatedUserData, type: "login" }));

        ws.send(JSON.stringify({ type: "newRoomSucces", payload: addRoom }));
      } else {
        throw new Error("Already subscribed");
      }
    };

    if (type === "createRoom") {
      try {
        const rooms = await getRooms(true);

        if (!rooms.includes(newRoom.toUpperCase())) {
          const newPost = {
            username: "Chat Bot",
            msg: `${user.username} created ${newRoom}`,
            time: admin.firestore.Timestamp.now(),
            avatar:
              "https://cdn.iconscout.com/icon/premium/png-256-thumb/system-1750733-1488785.png",
          };

          await firestore.collection(newRoom).add(newPost);

          await addUserToRoom();
        } else {
          ws.send(
            JSON.stringify({
              type: "createRoomError",
              payload: { type: Error, message: "Room already exists." },
            })
          );
        }
      } catch (err) {
        console.log(err);
        ws.send(
          JSON.stringify({
            type: "createRoomError",
            payload: err,
          })
        );
      }
    }

    if (type === "joinRoom") {
      try {
        const rooms = await getRooms();

        let foundRoom;

        for (let i = 0; i < rooms.length; i++) {
          if (rooms[i].toUpperCase() === newRoom.toUpperCase()) {
            foundRoom = rooms[i];
            break;
          }
        }

        if (foundRoom) {
          try {
            await addUserToRoom(foundRoom);
          } catch (err) {
            ws.send(
              JSON.stringify({
                type: "joinRoomError",
                payload: { type: Error, message: "Already subscribed." },
              })
            );
          }
        } else {
          ws.send(
            JSON.stringify({
              type: "joinRoomError",
              payload: { type: Error, message: "Room does not exist." },
            })
          );
        }
      } catch (err) {
        console.log(err);
        ws.send(
          JSON.stringify({
            type: "joinRoomError",
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
        if (client.readyState === WebSocket.OPEN)
          client.send(JSON.stringify({ type: "userLeft", payload: ws.uid }));
      });
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(PORT);
