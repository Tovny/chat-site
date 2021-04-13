import { useState, useRef } from "react";

import firebase from "firebase/app";

import {
  Container,
  Button,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const PasswordReset = ({ setActivePage }) => {
  const classes = useStyles();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const emailRef = useRef(null);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      await firebase.auth().sendPasswordResetEmail(emailRef.current.value);

      setSuccess(
        "An email with the instructions on how to reset the password has been sent."
      );
    } catch (err) {
      setError(err);
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
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
          <Link
            href="#"
            variant="body2"
            onClick={() => setActivePage("signIn")}
          >
            Sign In
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default PasswordReset;
