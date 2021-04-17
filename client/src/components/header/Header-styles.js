import { makeStyles } from "@material-ui/core/styles";

const headerStyles = makeStyles({
  headerToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "4rem",
  },
  roomsOpen: {
    display: "flex",
    alignItems: "center",
  },
  roomsMenu: {
    marginRight: "0.25rem",
  },
  usersOpen: {
    display: "flex",
    alignItems: "center",
  },
  usersMenu: {
    marginLeft: "0.5rem",
  },
  userAvatar: {
    marginLeft: "0.75rem",
    height: "2rem",
    width: "2rem",
  },
});

export default headerStyles;
