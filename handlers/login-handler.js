const loginHandler = async (wss, ws, firestore, payload, user) => {
  let doc = (await firestore.collection("users").doc(payload).get()).data();

  if (!doc) {
    const newUser = {
      rooms: [],
    };

    await firestore.collection("users").doc(user.uid).set(newUser);

    doc = (await firestore.collection("users").doc(payload).get()).data();
  }

  ws.send(JSON.stringify({ payload: doc, type: "login" }));
};

module.exports = loginHandler;
