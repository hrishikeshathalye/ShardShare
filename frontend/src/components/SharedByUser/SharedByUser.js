
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '../List/List'
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function SharedByUser(props) {
  const classes = useStyles();

  return (
    <List listItems={["A", "B", "C", "D"]} buttonName = {"Reshare"}/>
  );
}

