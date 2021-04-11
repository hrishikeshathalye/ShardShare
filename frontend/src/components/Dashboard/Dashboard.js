import React from "react";
import Nav from "../Navbar/Nav";
import MasterCard from "./Card.js";
import { Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  MasterCard: {
    justify: "center",
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));
function Dashboard() {
    const classes = useStyles()
    return (
        <div className={classes.root} >
            <Grid container justify = "center" spacing = {3}>
                <Grid container item xs  >
                    <div className={classes.MasterCard}>
                    <MasterCard title="Create new Secret" description = "Add new secret, shard it, and share!" image="/images/lock1.png" link = '/create_secret'/>
                    </div>
                </Grid>
                <Grid container item xs >
                <div className={classes.MasterCard}>
                    <MasterCard title="Your secrets" description = "Seccrets that you created and shared" image="/images/confidential.png" link = '/sharedbyyou'/>
                    </div>
                </Grid>
                <Grid container item xs >
                <div className={classes.MasterCard}>
                    <MasterCard title="Secrets shared with you" description = "Secrets in which you are a participant" image="/images/key.png" link = '/sharedwithyou' />
                    </div>
                </Grid>
                <Grid container item xs >
                <div className={classes.MasterCard}>
                    <MasterCard title="Recovery Requests" description = "Inbox of recovery requests" image="/images/key.png" link = '/recoveryrequests' />
                    </div>
                </Grid>
               </Grid>
            </div>
    );

}

export default Dashboard;
