import { webSocket } from "rxjs/webSocket";
import { catchError, map, filter } from "rxjs/operators";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

const WS_ENDPOINT = "ws://localhost:5000";

// OBSERVABLES

export const socket$ = new webSocket(WS_ENDPOINT);

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

// ACTIONS

export const getMessages = (user) => {
  socket$.next({ type: "join", user });
};

export const sendMessage = (msg, user) => {
  socket$.next({ type: "message", payload: msg, user });
};

export const sendLogin = (uid, user) => {
  socket$.next({ type: "login", payload: uid, user });
};

export const sendLogout = (user) => {
  socket$.next({ type: "logout", user });
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
