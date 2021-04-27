const WebSocket = require("ws");

const userChangeHandler = (wss, ws, oldUser, newUser) => {
  let otherSockets = false;

  if (!newUser) return;

  if (!oldUser) {
    wss.clients.forEach((client) => {
      if (client.room === ws.room && client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify({ type: "newUser", payload: [newUser] }));
    });
  } else {
    wss.clients.forEach((client) => {
      if (client.uid === ws.uid && client.room === ws.room && client !== ws)
        otherSockets = true;
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
};

module.exports = userChangeHandler;
