const WebSocket = require("ws");

const userChangeHandler = (wss, ws, oldUser, newUser) => {
  if (!newUser) return;

  if (!oldUser) {
    wss.clients.forEach((client) => {
      if (client.room === ws.room && client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify({ type: "newUser", payload: [newUser] }));
    });
  } else {
    const otherSockets = wss.clients.some((client) => {
      client.uid === ws.uid && client.room === ws.room && client !== ws;
    });

    wss.clients.forEach((client) => {
      if (client.room === ws.room && client.readyState === WebSocket.OPEN)
        client.send(
          JSON.stringify({
            type: "newUser",
            payload: [newUser],
          })
        );

      if (
        !otherSockets &&
        client.room === ws.room &&
        client.readyState === WebSocket.OPEN
      )
        client.send(JSON.stringify({ type: "userLeft", payload: oldUser.uid }));
    });
  }

  ws.username = newUser.username;
  ws.uid = newUser.uid;
  ws.avatar = newUser.avatar;
};

module.exports = userChangeHandler;
