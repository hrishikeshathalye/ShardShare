import React from "react";
import MasterCard from "./Card.js";
import { Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import "shepherd.js/dist/css/shepherd.css";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
  },
  MasterCard: {
    margin: "auto",
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  bottomSpacing: {
    padding: "1rem",
  },
}));
function Dashboard() {
  const classes = useStyles();
  return (
    <div>
      <Grid container className={classes.root}>
        <Grid
          container
          item
          xs={12}
          md={3}
          justify="center"
          id="createSecret"
          className={classes.bottomSpacing}
        >
          <MasterCard
            className={classes.MasterCard}
            title="Create New Secret"
            description="Add new secret, shard it, and share!"
            image="/images/lock_2.png"
            link="/create_secret"
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={3}
          justify="center"
          id="yourSecrets"
          className={classes.bottomSpacing}
        >
          <MasterCard
            className={classes.MasterCard}
            title="Your Secrets"
            description="Secrets that you created and shared"
            image="/images/unlock.png"
            link="/sharedbyyou"
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={3}
          justify="center"
          id="sharedWithYou"
          className={classes.bottomSpacing}
        >
          <MasterCard
            className={classes.MasterCard}
            title="Secrets Shared With You"
            description="Secrets in which you are a participant"
            image="/images/network.png"
            link="/sharedwithyou"
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={3}
          justify="center"
          id="recoveryRequests"
          className={classes.bottomSpacing}
        >
          <MasterCard
            className={classes.MasterCard}
            title="Recovery Requests"
            description="Inbox of recovery requests"
            image="/images/padlock.png"
            link="/recoveryrequests"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
