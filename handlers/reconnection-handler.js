const reconnectionHandler = async (wss, ws, firestore, user, room, payload) => {
  if (payload.reconnect) {
    ws.username = user.username;
    ws.uid = user.uid;
    ws.avatar = user.avatar;
    ws.room = room;

    const fireMessages = await firestore
      .collection(room)
      .orderBy("time", "desc")
      .get();

    const messages = new Array();

    for (let doc of fireMessages) {
      const message = doc.data();
      message.id = doc.id;

      if (message.id !== payload.lastMessage) {
        messages.unshift(message);
      } else {
        break;
      }
    }

    if (messages.length > 0)
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
};

module.exports = reconnectionHandler;
