import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "../List/List";
import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  media: {
    height: 140,
  },
});

export default function SharedWithUser(props) {
  const classes = useStyles();

  return (
    <cntainer>
      <Box
        display="flex"
        justifyContent="center"
        m={1}
        p={1}
        bgcolor="background.paper"
      >
        <Typography variant="h4" gutterBottom>
          Secrets shared with you.
        </Typography>
      </Box>

      <List listItems={["A", "B", "C", "D"]} />
    </cntainer>
  );
}
