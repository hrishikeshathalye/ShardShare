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
import { trackPromise } from "react-promise-tracker";
import { useHistory } from "react-router-dom";
import {
  recoverSecret,
  approveRequest,
  rejectRequest,
} from "../../api/index.js";
import { toast } from "react-toastify";
import TextField from "@material-ui/core/TextField";

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
  buttons: {
    width: "100%",
    margin: "0.5rem",
  },
  shardText: {
    display: "block",
  },
}));

export default function InteractiveList(props) {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [shard, setShard] = React.useState(false);
  const history = useHistory();
  const handleRecover = (secret) => {
    trackPromise(
      recoverSecret(secret._id)
        .then((res) => {
          toast.success(res.data.message);
          window.location.reload(false);
        })
        .catch((res) => {
          toast.error(res.response.data.message);
          window.location.reload(false);
        })
    );
  };

  const handleReject = (secret) => {
    trackPromise(
      rejectRequest(secret._id, secret.requester)
        .then((res) => {
          toast.warning(res.data.message);
          window.location.reload(false);
        })
        .catch((res) => {
          toast.error(res.response.data.message);
          window.location.reload(false);
        })
    );
  };

  const handleReshare = (secret) => {
    history.push("/create_secret", { secret: secret });
  };

  const handleAccept = (secret, shard) => {
    trackPromise(
      approveRequest(secret._id, secret.requester, shard)
        .then((res) => {
          toast.success(res.data.message);
          window.location.reload(false);
        })
        .catch((res) => {
          toast.error(res.response.data.message);
          window.location.reload(false);
        })
    );
  };

  const get_button_by_list_type = (type, secret, shard) => {
    if (type === "shared_by_user") {
      return (
        <Button
          className={classes.buttons}
          variant="outlined"
          id="reshare"
          color="primary"
          onClick={() => handleReshare(secret)}
        >
          Modify & Reshare
        </Button>
      );
    }
    if (type === "shared_with_user") {
      if (secret.state === "pending") {
        return (
          <Button
            className={classes.buttons}
            variant="outlined"
            id="requestPending"
            color="primary"
            id="recover"
            disabled
          >
            Request Pending
          </Button>
        );
      }
      if (secret.state === "accepted") {
        return (
          <Button
            className={classes.buttons}
            variant="outlined"
            color="primary"
            href={`/recombine/${secret.k}`}
            id="recover"
          >
            Recombine Secret
          </Button>
        );
      }
      return (
        <Button
          className={classes.buttons}
          variant="outlined"
          color="primary"
          id="recover"
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
            className={classes.buttons}
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
          className={classes.buttons}
          variant="outlined"
          color="primary"
          href="#outlined-buttons"
          id="reject"
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
            className={classes.buttons}
            variant="outlined"
            color="primary"
            href="#outlined-buttons"
            disabled
          >
            Request Recovered
          </Button>
        );
      }
      return (
        <Button
          className={classes.buttons}
          variant="outlined"
          color="primary"
          id="accept"
          onClick={() => handleAccept(secret, shard)}
        >
          Accept
        </Button>
      );
    }
  };
  let participants = props.secret.sharedWith.map((ele, index) => {
    return (
      <ListItem key={index.toString()}>
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
              <ListItem id="secretName">
                <ListItemAvatar>
                  <Avatar>
                    <VpnKeyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Secret name"
                  secondary={props.secret.secretName}
                />
                <ListItemSecondaryAction></ListItemSecondaryAction>
              </ListItem>
              <ListItem id="secretId">
                <ListItemAvatar>
                  <Avatar>
                    <FormatListNumberedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="secretId" secondary={props.secret._id} />
              </ListItem>
              <ListItem id="participants">
                <ListItemAvatar>
                  <Avatar>
                    <PersonAddIcon />
                  </Avatar>
                </ListItemAvatar>
                <MouseOverPopover content={participants} />
              </ListItem>
              <ListItem id="date">
                <ListItemAvatar>
                  <Avatar>
                    <EventIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Date" secondary={props.secret.date} />
              </ListItem>
              <ListItem>
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
                    className={classes.shardText}
                  />
                ) : (
                  get_button_by_list_type(props.list_for, props.secret, shard)
                )}
              </ListItem>
              <ListItem>
                {props.list_for === "recovery_requests" ? (
                  get_button_by_list_type(
                    "recovery_requests_accept",
                    props.secret,
                    shard
                  )
                ) : (
                  <></>
                )}

                {props.list_for === "recovery_requests" ? (
                  get_button_by_list_type(
                    "recovery_requests_reject",
                    props.secret,
                    shard
                  )
                ) : (
                  <></>
                )}
              </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
