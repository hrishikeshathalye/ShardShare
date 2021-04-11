import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import FolderIcon from "@material-ui/icons/Folder";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Typography from "@material-ui/core/Typography";
import MouseOverPopover from "./PopOver";
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import EventIcon from "@material-ui/icons/Event";
import {recoverSecret} from "../../api/index.js"
import {toast} from 'react-toastify';
import TextField from "@material-ui/core/TextField";
toast.configure()
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

const handleRecover = (secret_id)=>{
  console.log(secret_id);
  recoverSecret(secret_id).then(()=>{
    toast.success("Recovery Request Initiated")
  }).catch(()=>{
    toast.failure("Some Error Occured")
  })
}

const handleReject = (secret_id)=>{
  console.log(secret_id);
  recoverSecret(secret_id).then(()=>{
    toast.success("Recovery Request Initiated")
  }).catch(()=>{
    toast.failure("Some Error Occured")
  })
}

const handleAccept = (secret_id)=>{
  console.log(secret_id);
  recoverSecret(secret_id).then(()=>{
    toast.success("Recovery Request Initiated")
  }).catch(()=>{
    toast.failure("Some Error Occured")
  })
}

const get_button_by_list_type = (type, secret_id) => {
  if (type === "shared_by_user") {
    return (
      <Button  variant="outlined" color="primary" href="#outlined-buttons">
        Modify & Reshare
      </Button>
    );
  }
  if (type === "shared_with_user") {
    return (
      <Button variant="outlined" color="primary" href="#outlined-buttons" onClick={()=>handleRecover(secret_id)}>
        Recover
      </Button>
    );
  }
   if (type === "recovery_requests_reject") {
    return (
      <Button variant="outlined" color="primary" href="#outlined-buttons" onClick={()=>handleRecover(secret_id)}>
        Reject
      </Button>
    );
  }
    if (type === "recovery_requests_accept") {
    return (
      <Button variant="outlined" color="primary" href="#outlined-buttons" onClick={()=>handleRecover(secret_id)}>
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
                  {props.list_for === "recovery_requests" ?  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="shard"
                    label="Shard"
                    id="shard"
                    onChange = {(e)=>{setShard(e.target.value)}}
                  />  : get_button_by_list_type(props.list_for, props.secret._id)}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <FormatListNumberedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="secretId" secondary={props.secret._id} />
                <ListItemSecondaryAction>{
                (props.list_for === "recovery_requests") ?
                    get_button_by_list_type("recovery_requests_accept", props.secret._id) : <></>
                }
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonAddIcon />
                  </Avatar>
                </ListItemAvatar>
                <MouseOverPopover content={participants} />
                <ListItemSecondaryAction>{
                  props.list_for === "recovery_requests" ?
                    get_button_by_list_type("recovery_requests_reject", props.secret._id)
                  : <></> }
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
