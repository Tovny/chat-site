const WebSocket = require("ws");

const joinRoomHandler = async (wss, ws, room, firestore) => {
  const fireMessages = await firestore
    .collection(room)
    .orderBy("time", "asc")
    .limitToLast(50)
    .get();

  const messages = new Array();

  fireMessages.forEach((doc) => {
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
};

module.exports = joinRoomHandler;
