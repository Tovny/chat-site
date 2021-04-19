import { Subject } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import { catchError, map, filter, pairwise } from "rxjs/operators";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

const WS_ENDPOINT = "wss://chat-app-tovny.herokuapp.com/";

// OBSERVABLES

export const socket$ = new webSocket(WS_ENDPOINT);
export const userSubject$ = new Subject().pipe(pairwise());
export const roomSubject$ = new Subject().pipe(pairwise());

const createObservable = (type) => {
  return socket$.pipe(
    filter((msg) => msg.type === type),
    map((msg) => msg.payload),
    catchError((err) => console.log(err))
  );
};

export const messages$ = createObservable("message");

export const activeUsers$ = createObservable("newUser");

export const userLeave$ = createObservable("userLeft");

export const login$ = createObservable("login");

export const registrationError$ = createObservable("registrationError");

export const registrationSuccess$ = createObservable("registrationSuccess");

export const createRoomError$ = createObservable("createRoomError");

export const joinRoomError$ = createObservable("joinRoomError");

export const newRoomSuccess$ = createObservable("newRoomSucces");

// ACTIONS

export const getMessages = (user, room) => {
  socket$.next({ type: "join", user, room });
};

export const sendMessage = (msg, user, room) => {
  socket$.next({ type: "message", payload: msg, user, room });
};

export const sendLogin = (uid, user) => {
  socket$.next({ type: "login", payload: uid, user });
};

export const sendLogout = (user) => {
  socket$.next({ type: "logout", user });
};

export const sendUserChange = (oldUser, newUser) => {
  socket$.next({ type: "userChange", oldUser, newUser });
};

export const sendRoomChange = (oldRoom, newRoom) => {
  socket$.next({ type: "roomChange", oldRoom, newRoom });
};

export const createEmailUser = (payload) => {
  socket$.next({ type: "newEmailUser", payload });
};

export const createNewRoom = (newRoom, user) => {
  socket$.next({ type: "createRoom", newRoom, user });
};

export const joinNewRoom = (newRoom, user) => {
  socket$.next({ type: "joinRoom", newRoom, user });
};

// CUSTOM HOOKS

export const useObservable = (observable, setter) => {
  const dispatch = useDispatch();

  useEffect(() => {
    observable.subscribe((msg) => {
      dispatch(setter(msg));
    });

    return () => {
      observable.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observable]);
};

export const useObservableLocal = (observable, setter) => {
  useEffect(() => {
    observable.subscribe((msg) => {
      setter(msg);
    });

    return () => {
      observable.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observable]);
};
