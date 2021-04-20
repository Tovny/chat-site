const WebSocket = require("ws");

const logoutHandler = (wss, ws) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN)
      client.send(
        JSON.stringify({
          type: "newUser",
          payload: [{ username: ws.username, avatar: ws.avatar, uid: ws.uid }],
        })
      );
  });
};

module.exports = logoutHandler;
