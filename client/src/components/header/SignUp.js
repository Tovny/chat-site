import { useState, useEffect, useRef } from "react";

import firebase from "firebase";

import {
  registrationError$,
  registrationSuccess$,
  useObservableLocal,
  createEmailUser,
} from "../../websocket";

import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp({ setActivePage }) {
  const classes = useStyles();

  const usernameRef = useRef(null);
  const avatarRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useObservableLocal(registrationError$, setError);

  useEffect(() => {
    registrationSuccess$.subscribe((token) => {
      firebase.auth().signInWithCustomToken(token);
    });

    return () => {
      registrationSuccess$.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [error]);

  const handleSubmit = (e) => {
    setLoading(true);
    setError(null);

    e.preventDefault();

    createEmailUser({
      username: usernameRef.current.value,
      avatar: avatarRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error.message}</Alert>
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField
                autoComplete="uname"
                name="usertName"
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="User Name"
                autoFocus
                inputRef={usernameRef}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete="avatar"
                name="avatar"
                variant="outlined"
                required
                fullWidth
                id="avatar"
                label="Avatar"
                inputRef={avatarRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputRef={emailRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => setActivePage("signIn")}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
