import React from "react";
import Nav from "../Navbar/Nav";
import MasterCard from "./Card.js";
import { Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { ShepherdTour, ShepherdTourContext } from "react-shepherd";
const steps = [
  {
    id: "intro",
    // attachTo: ".first-element bottom",
    beforeShowPromise: function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          window.scrollTo(0, 0);
          resolve();
        }, 500);
      });
    },
    buttons: [
      {
        classes: "shepherd-button-secondary",
        text: "Exit",
        type: "cancel",
      },
      {
        classes: "shepherd-button-primary",
        text: "Back",
        type: "back",
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
      },
    ],
    classes: "custom-class-name-1 custom-class-name-2",
    highlightClass: "highlight",
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: "Welcome to React-Shepherd!",
    text: [
      "React-Shepherd is a JavaScript library for guiding users through your React app.",
    ],
    when: {
      show: () => {
        console.log("show step");
      },
      hide: () => {
        console.log("hide step");
      },
    },
  },
  // ...
];
const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
};
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
}));
function Dashboard() {
  const tour = useContext(ShepherdTourContext);
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid container item xs={12} md={3} justify="center">
        <MasterCard
          className={classes.MasterCard}
          title="Create New Secret"
          description="Add new secret, shard it, and share!"
          image="/images/lock1.png"
          link="/create_secret"
        />
      </Grid>
      <Grid container item xs={12} md={3} justify="center">
        <MasterCard
          className={classes.MasterCard}
          title="Your Secrets"
          description="Secrets that you created and shared"
          image="/images/confidential.png"
          link="/sharedbyyou"
        />
      </Grid>
      <Grid container item xs={12} md={3} justify="center">
        <MasterCard
          className={classes.MasterCard}
          title="Secrets Shared With You"
          description="Secrets in which you are a participant"
          image="/images/key.png"
          link="/sharedwithyou"
        />
      </Grid>
      <Grid container item xs={12} md={3} justify="center">
        <MasterCard
          className={classes.MasterCard}
          title="Recovery Requests"
          description="Inbox of recovery requests"
          image="/images/key.png"
          link="/recoveryrequests"
        />
      </Grid>
      <ShepherdTour steps={steps} tourOptions={tourOptions}>
        <button className="button dark" onClick={tour.start}>
          Start Tour
        </button>
      </ShepherdTour>
    </Grid>
  );
}

export default Dashboard;
