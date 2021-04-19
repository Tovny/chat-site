import { makeStyles } from "@material-ui/core/styles";

const useMessageStyles = makeStyles({
  chatWindow: {
    margin: 0,
    padding: 0,
  },
  messageWindow: {},
  messagesContainer: {
    height: "calc(100vh - 8.75rem)",
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
  typingGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 55px",
    marginTop: "1rem",
  },
  activeUsersContainer: {
    display: "flex",
    flexFlow: "column",
    height: "calc(100vh - 4.25rem)",
    padding: "0 0.5rem",
  },
  activeUsersContainerDrawer: {
    display: "flex",
    flexFlow: "column",
    height: "100vh",
    minWidth: "50vw",
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