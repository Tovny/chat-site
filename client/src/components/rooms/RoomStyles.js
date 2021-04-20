import { makeStyles } from "@material-ui/core/styles";

const roomStyles = makeStyles((theme) => ({
  roomsContainer: {
    marginTop: 10,
    padding: "0 0.5rem",
    height: "calc(100vh - 5rem)",
    display: "flex",
    flexFlow: "column",
  },
  roomsDrawer: {
    padding: "1rem",
    height: "100%",
    display: "flex",
    flexFlow: "column",
  },
  drawerGlobalDiv: {
    display: "flex",
    alignItems: "center",
  },
  closeIcon: {
    marginLeft: "0.25rem",
  },
  globalButton: {
    border: "3px solid black",
    "&:hover": {
      border: "3px solid black",
    },
  },
  subbedHeading: {
    margin: "10px 0",
  },
  subbedRooms: {
    flex: "1 1 auto",
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
