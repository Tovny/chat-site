const emailRegistrationHandler = async (wss, ws, admin, firestore, payload) => {
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
        ws.send(JSON.stringify({ type: "registrationError", payload: err }));
      }
    }
  }
};

module.exports = emailRegistrationHandler;
