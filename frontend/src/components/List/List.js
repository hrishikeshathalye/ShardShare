import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import ListItem from "./ListItem";
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function List(props) {
  const classes = useStyles();
  let listItems = props.listItems.map((ele, index) => {
    return <ListItem secret={ele} key={index} list_for={props.list_for} />;
  });
  return <Container>{listItems}</Container>;
}
