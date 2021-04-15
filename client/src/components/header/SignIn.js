import { useState, useRef } from "react";

import firebase from "firebase/app";

import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Google from "../../assets/Google.png";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  google: {
    height: "1.5rem",
    position: "absolute",
    left: "0.5rem",
  },
}));

export default function SignIn({ setActivePage }) {
  const classes = useStyles();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError(null);
      await firebase
        .auth()
        .signInWithEmailAndPassword(
          emailRef.current.value,
          passwordRef.current.value
        );
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={emailRef}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={passwordRef}
          />
          <Grid container>
            <Grid item xs>
              <Link
                href="#"
                variant="body2"
                onClick={() => setActivePage("passwordReset")}
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => setActivePage("signUp")}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
        <Button
          variant="contained"
          fullWidth
          onClick={async () => {
            try {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
              await firebase.auth().signInWithPopup(googleAuthProvider);
            } catch (err) {
              setError(err);
            }
          }}
        >
          <img src={Google} alt="Google Icon" className={classes.google}></img>
          Sign In with Google
        </Button>
      </div>
    </Container>
  );
}
