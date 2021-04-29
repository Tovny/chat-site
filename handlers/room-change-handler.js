const WebSocket = require("ws");

const roomChangeHandler = (wss, ws, oldRoom, newRoom) => {
  const otherSockets = wss.clients.some((client) => {
    client.uid === ws.uid && client.room === oldRoom && client !== ws;
  });

  if (!otherSockets)
    wss.clients.forEach((client) => {
      if (client.room === oldRoom && client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify({ type: "userLeft", payload: ws.uid }));
    });

  wss.clients.forEach((client) => {
    if (client.room === newRoom && client.readyState === WebSocket.OPEN)
      client.send(
        JSON.stringify({
          type: "newUser",
          payload: [{ username: ws.username, uid: ws.uid, avatar: ws.avatar }],
        })
      );
  });

  ws.room = newRoom;
};

module.exports = roomChangeHandler;
