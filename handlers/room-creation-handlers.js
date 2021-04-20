const getRooms = async (upperCase = false, firestore) => {
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

const addUserToRoom = async (ws, addRoom, firestore, user) => {
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

    const updatedUser = await firestore.collection("users").doc(user.uid).get();
    const updatedUserData = updatedUser.data();

    ws.send(JSON.stringify({ payload: updatedUserData, type: "login" }));

    ws.send(JSON.stringify({ type: "newRoomSucces", payload: addRoom }));
  } else {
    throw new Error("Already subscribed");
  }
};

const createRoomHandler = async (wss, ws, admin, firestore, newRoom, user) => {
  try {
    const rooms = await getRooms(true, firestore);

    if (!rooms.includes(newRoom.toUpperCase())) {
      const newPost = {
        username: "Chat Bot",
        msg: `${user.username} created ${newRoom}`,
        time: admin.firestore.Timestamp.now(),
        avatar:
          "https://cdn.iconscout.com/icon/premium/png-256-thumb/system-1750733-1488785.png",
      };

      await firestore.collection(newRoom).add(newPost);

      await addUserToRoom(ws, newRoom, firestore, user);
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
};

const joinNewRoomHandler = async (wss, ws, firestore, newRoom, user) => {
  try {
    const rooms = await getRooms(false, firestore);

    let foundRoom;

    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].toUpperCase() === newRoom.toUpperCase()) {
        foundRoom = rooms[i];
        break;
      }
    }

    if (foundRoom) {
      try {
        await addUserToRoom(ws, foundRoom, firestore, user);
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
};

module.exports = { createRoomHandler, joinNewRoomHandler };
