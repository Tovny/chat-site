import { makeStyles } from "@material-ui/core/styles";

const headerStyles = makeStyles({
  headerToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "4rem",
  },
  userAvatar: {
    marginLeft: "0.75rem",
  },
});

export default headerStyles;
