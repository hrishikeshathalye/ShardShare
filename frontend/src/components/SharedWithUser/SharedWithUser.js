import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "../List/List";
import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";
import { getSharedWithUser } from "../../api/index";
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
  const [secrets, setSecrets] = useState([]);
  useEffect(() => {
    getSharedWithUser().then((res) => {
      //console.log(res.data);
      setSecrets(res.data.secret_array);
    });
  }, []);
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
          Secrets Shared With You
        </Typography>
      </Box>

      <List listItems={secrets} list_for={"shared_with_user"} />
    </cntainer>
  );
}
