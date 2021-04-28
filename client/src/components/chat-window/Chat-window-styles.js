import { makeStyles } from "@material-ui/core/styles";

const useMessageStyles = makeStyles({
  chatWindow: {
    margin: 0,
    padding: 0,
  },
  messageWindow: {
    height: "calc(100vh - 4rem)",
    height: "calc(var(--vh, 1vh) * 100 - 4rem)",
    display: "flex",
    position: "relative",
    flexFlow: "column",
  },
  messagesContainer: {
    flex: "1 1 auto",
    overflow: "auto",
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      borderRadius: "7px",
    },
    "&::-webkit-scrollbar": {
      width: "7px",
    },
  },
  messagesList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    marginTop: "1rem",
  },
  messageLi: {
    display: "grid",
    gridTemplateColumns: "50px 1fr",
  },
  postUsername: {
    fontWeight: "bold",
  },
  postTime: {
    marginLeft: ".75rem",
    fontSize: "0.7rem",
    color: "#525252",
  },
  postHeadingPaper: {
    display: "flex",
    alignItems: "center",
    padding: "5px 10px",
  },
  visiblePostTime: {
    opacity: 1,
    alignSelf: "center",
  },
  hiddenPostTime: {
    opacity: 0,
  },
  messageText: {
    margin: "0 0.5rem",
    gridColumnStart: 2,
  },
  warningPaper: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bottom: "5rem",
    right: "1rem",
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    zIndex: 5,
    opacity: "0.6",
    overflow: "hidden",
  },
  downArrow: {
    height: "2rem",
    width: "2rem",
  },
  typingForm: {
    flex: "0 1 auto",
  },
  typingGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 55px",
  },
  activeUsersContainer: {
    display: "flex",
    flexFlow: "column",
    height: "calc(100vh - 4.5rem)",
    padding: "0 0.5rem",
  },
  activeUsersContainerDrawer: {
    display: "flex",
    flexFlow: "column",
    height: "100%",
    minWidth: "225px",
    padding: "1rem",
  },
  drawerUsersDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeUsers: {
    flex: "1 1 auto",
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
  activesHeading: {
    margin: "10px 0",
  },
  activeUserContainer: {
    padding: "0.5rem",
  },
  activeUserAvatar: {
    marginRight: "0.5rem",
    height: "1.75rem",
    width: "1.75rem",
  },
});

export default useMessageStyles;
