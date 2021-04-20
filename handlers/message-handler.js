const WebSocket = require("ws");

const messageHandler = async (
  wss,
  ws,
  admin,
  firestore,
  payload,
  user,
  room
) => {
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
};

module.exports = messageHandler;
