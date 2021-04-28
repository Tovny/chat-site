import { useDispatch } from "react-redux";
import setOpenActiveUsersDrawer from "../../redux/actions/active-users-drawer-actions";

import { Avatar, Typography, Grid, Paper } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const ActiveUsers = ({ activeUsers, classes, drawer = false }) => {
  const dispatch = useDispatch();

  return (
    <div
      className={
        !drawer
          ? classes.activeUsersContainer
          : classes.activeUsersContainerDrawer
      }
    >
      {!drawer && (
        <Typography
          variant="h6"
          align="center"
          className={classes.activesHeading}
        >
          Active Users
        </Typography>
      )}
      {drawer && (
        <div className={classes.drawerUsersDiv}>
          <CloseIcon
            className={classes.closeIcon}
            onClick={() => dispatch(setOpenActiveUsersDrawer(false))}
          />
          <Typography
            variant="h6"
            align="center"
            className={classes.activesHeading}
          >
            Active Users
          </Typography>
        </div>
      )}
      <Paper variant="outlined" square className={classes.activeUsers}>
        {activeUsers?.map(
          (user, i) =>
            user.username && (
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
                <Typography variant="subtitle2">{user.username}</Typography>
              </Grid>
            )
        )}
      </Paper>
    </div>
  );
};

export default ActiveUsers;
