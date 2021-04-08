import { webSocket } from "rxjs/webSocket";
import { catchError, map, filter } from "rxjs/operators";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

const WS_ENDPOINT = "ws://localhost:5000";

// OBSERVABLES

export const socket$ = new webSocket(WS_ENDPOINT);

export const messages$ = socket$.pipe(
  filter((msg) => msg.type === "message"),
  map((msg) => msg.payload),
  catchError((err) => console.log(err))
);

export const activeUsers$ = socket$.pipe(
  filter((msg) => msg.type === "newUser"),
  map((msg) => msg.payload)
);

export const userLeave$ = socket$.pipe(
  filter((msg) => msg.type === "userLeft"),
  map((msg) => msg.payload)
);

export const login$ = socket$.pipe(
  filter((msg) => msg.type === "login"),
  map((msg) => msg.payload)
);

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
  socket$.next({ type: "userLeft", user });
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
