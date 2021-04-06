import { makeStyles } from "@material-ui/core/styles";

const useMessageStyles = makeStyles({
  messagesContainer: {
    height: "93vh",
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
  postUsername: {
    fontWeight: "bold",
  },
  postTime: {
    marginLeft: "0.5rem",
  },
  postHeadingPaper: {
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
  },
});

export default useMessageStyles;
