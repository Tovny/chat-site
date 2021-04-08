import { Avatar, Typography, Grid } from "@material-ui/core";

const ActiveUsers = ({ activeUsers, classes }) => {
  return (
    <>
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
