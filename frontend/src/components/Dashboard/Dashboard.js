import React from "react";
import Nav from "../Navbar/Nav";
import MasterCard from "./Card.js";
import { Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center"
  },
  MasterCard: {
    margin:"auto",
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));
function Dashboard() {
    const classes = useStyles()
    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid container item xs={12} md={3} justify="center">
                <MasterCard className={classes.MasterCard} title="Create New Secret" description = "Add new secret, shard it, and share!" image="/images/lock1.png" link = '/create_secret'/>
            </Grid>
            <Grid container item xs={12} md={3} justify="center">
                <MasterCard className={classes.MasterCard} title="Your Secrets" description = "Seccrets that you created and shared" image="/images/confidential.png" link = '/sharedbyyou'/>
            </Grid>
            <Grid container item xs={12} md={3} justify="center">
                <MasterCard className={classes.MasterCard} title="Secrets Shared With You" description = "Secrets in which you are a participant" image="/images/key.png" link = '/sharedwithyou' />
            </Grid>
            <Grid container item xs={12} md={3} justify="center">
                <MasterCard className={classes.MasterCard} title="Recovery Requests" description = "Inbox of recovery requests" image="/images/key.png" link = '/recoveryrequests' />
            </Grid>
        </Grid>
    );

}

export default Dashboard;
