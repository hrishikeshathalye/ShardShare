import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import MouseOverPopover from "./PopOver";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import EventIcon from "@material-ui/icons/Event";
import { trackPromise } from 'react-promise-tracker';
import {
  recoverSecret,
  approveRequest,
  rejectRequest,
} from "../../api/index.js";
import { toast } from "react-toastify";
import TextField from "@material-ui/core/TextField";

toast.configure();
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  list: {
    backgroundColor: "#eeeeee",
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const handleRecover = (secret) => {
  console.log(secret._id);
  trackPromise(
  recoverSecret(secret._id)
    .then(() => {
      toast.success("Recovery Request Initiated");
    })
    .catch(() => {
      toast.failure("Some Error Occured");
    })
  );
};

const handleReject = (secret) => {
  trackPromise(
  rejectRequest(secret._id, secret.requester)
    .then(() => {
      toast.warning("Recovery Request Rejected!");
    })
    .catch(() => {
      toast.failure("Some Error Occured");
    })
  );
};

const handleAccept = (secret) => {
  console.log(secret);
  trackPromise(
  approveRequest(secret._id, secret.requester)
    .then(() => {
      toast.success("Recovery Request Accepted!");
    })
    .catch(() => {
      toast.failure("Some Error Occured");
    })
  );
};

const get_button_by_list_type = (type, secret) => {
  if (type === "shared_by_user") {
    return (
      <Button variant="outlined" color="primary" href="#outlined-buttons">
        Modify & Reshare
      </Button>
    );
  }
  if (type === "shared_with_user") {
    if (secret.state === "pending") {
      return (
        <Button
          variant="outlined"
          color="primary"
          href="#outlined-buttons"
          disabled
        >
          Request Pending
        </Button>
      );
    }
    if (secret.state === "accepted") {
      return (
        <Button
          variant="outlined"
          color="primary"
          href="#outlined-buttons"
          disabled
        >
          Request Recoverd
        </Button>
      );
    }
    return (
      <Button
        variant="outlined"
        color="primary"
        href="#outlined-buttons"
        onClick={() => handleRecover(secret)}
      >
        Recover
      </Button>
    );
  }
  if (type === "recovery_requests_reject") {
    if (secret.state === "accepted") {
      return (
        <Button
          variant="outlined"
          color="primary"
          href="#outlined-buttons"
          disabled
        >
          Request Recoverd
        </Button>
      );
    }
    return (
      <Button
        variant="outlined"
        color="primary"
        href="#outlined-buttons"
        onClick={() => handleReject(secret)}
      >
        Reject
      </Button>
    );
  }
  if (type === "recovery_requests_accept") {
    if (secret.state === "accepted") {
      return (
        <Button
          variant="outlined"
          color="primary"
          href="#outlined-buttons"
          disabled
        >
          Request Recoverd
        </Button>
      );
    }
    return (
      <Button
        variant="outlined"
        color="primary"
        href="#outlined-buttons"
        onClick={() => handleAccept(secret)}
      >
        Accept
      </Button>
    );
  }
};

export default function InteractiveList(props) {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [shard, setShard] = React.useState(false);
  let participants = props.secret.sharedWith.map((ele, index) => {
    return (
      <ListItem>
        <ListItemText primary={ele} />
      </ListItem>
    );
  });
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <div className={classes.list}>
            <List dense={dense}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <VpnKeyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Secret name"
                  secondary={props.secret.secretName}
                />
                <ListItemSecondaryAction>
                  {props.list_for === "recovery_requests" ? (
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="shard"
                      label="Shard"
                      id="shard"
                      onChange={(e) => {
                        setShard(e.target.value);
                      }}
                    />
                  ) : (
                    get_button_by_list_type(props.list_for, props.secret)
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <FormatListNumberedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="secretId" secondary={props.secret._id} />
                <ListItemSecondaryAction>
                  {props.list_for === "recovery_requests" ? (
                    get_button_by_list_type(
                      "recovery_requests_accept",
                      props.secret
                    )
                  ) : (
                    <></>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonAddIcon />
                  </Avatar>
                </ListItemAvatar>
                <MouseOverPopover content={participants} />
                <ListItemSecondaryAction>
                  {props.list_for === "recovery_requests" ? (
                    get_button_by_list_type(
                      "recovery_requests_reject",
                      props.secret
                    )
                  ) : (
                    <></>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EventIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Date" secondary={props.secret.date} />
              </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
