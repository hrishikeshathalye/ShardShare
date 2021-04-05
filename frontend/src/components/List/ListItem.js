
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Button} from '@material-ui/core'

const useStyles = makeStyles({
 listItem:{
     margin:'1.5rem',
     borderRadius:'1rem'
 },
 button:{
    float:'right'
 }
});

export default function ListItem(props) {
  const classes = useStyles();
  return (
    <div className={classes.listItem}>
        {props.secretName}
        <Button variant="contained" color="secondary" class={classes.button}>Share Shard</Button>
    </div>
  );
}

