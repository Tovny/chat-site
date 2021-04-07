import { makeStyles } from "@material-ui/core/styles";

const useMessageStyles = makeStyles({
  messagesContainer: {
    height: "calc(100vh - 5rem)",
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
  },
  messageLi: {
    display: "grid",
    gridTemplateColumns: "50px 1fr",
  },
  postUsername: {
    fontWeight: "bold",
  },
  postTime: {
    marginLeft: "0.5rem",
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
    gridTemplateColumns: "1fr 150px",
    marginTop: "1rem",
  },
});

export default useMessageStyles;
