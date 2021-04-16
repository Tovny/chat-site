import { makeStyles } from "@material-ui/core/styles";

const roomStyles = makeStyles((theme) => ({
  roomsContainer: {
    padding: 0,
    marginTop: 10,
    paddingRight: "0.5rem",
    height: "calc(100vh - 5rem)",
  },
  globalButton: {
    border: "3px solid black",
    height: "3rem",
    "&:hover": {
      border: "3px solid black",
    },
  },
  subbedHeading: {
    margin: "10px 0",
  },
  subbedRooms: {
    height: "83%",
    marginBottom: "10px",
    overflow: "auto",
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(0,0,0,.1)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.2)",
    },
    "&::-webkit-scrollbar": {
      width: "7px",
    },
  },
  roomButton: {
    padding: "1rem 0",
  },
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

export default roomStyles;
