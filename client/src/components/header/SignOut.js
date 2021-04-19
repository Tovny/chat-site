import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  signOut: {
    margin: theme.spacing(2, 0, 0),
  },
}));

export default function SignOut({ setSignOutOpen, firebase }) {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography variant="subtitle2">Signed in as:</Typography>
        <Typography variant="h6">{user.username}</Typography>
        <Button
          onClick={() => {
            setSignOutOpen(false);
            firebase.auth().signOut();
          }}
          color="primary"
          size="medium"
          variant="contained"
          fullWidth
          className={classes.signOut}
        >
          Sign Out
        </Button>
      </div>
    </Container>
  );
}
