import { useSelector } from "react-redux";
import { Avatar, Typography, Grid } from "@material-ui/core";

const ActiveUsers = ({ activeUsers, classes }) => {
  const thisUser = useSelector((state) => state.user);

  return (
    <>
      {thisUser && (
        <Grid
          container
          direction="row"
          alignItems="center"
          className={classes.activeUserContainer}
        >
          <Avatar
            alt={thisUser.username}
            src={thisUser.avatar}
            className={classes.activeUserAvatar}
          />
          <Typography variant="body1">{thisUser.username}</Typography>
        </Grid>
      )}
      {activeUsers?.map((user, i) => (
        <Grid
          key={i}
          container
          direction="row"
          alignItems="center"
          className={classes.activeUserContainer}
        >
          <Avatar
            alt={user.username}
            src={user.avatar}
            className={classes.activeUserAvatar}
          />
          <Typography variant="body1">{user.username}</Typography>
        </Grid>
      ))}
    </>
  );
};

export default ActiveUsers;
