import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "../List/List";
import Box from "@material-ui/core/Box";
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { combineShards } from "../../api/index";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import ShowSecret from "./ShowSecret";
toast.configure();
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  media: {
    height: 140,
  },
});

export default function RecoverSecret() {
  var { k } = useParams();
  var k_thresh = [];
  for (let i = 0; i < k; i++) {
    k_thresh.push("");
  }
  var [og_secret, setSecret] = useState("");
  const handleChange = (e, index) => {
    k_thresh[index] = e.target.value;
  };
  const handleRegenerate = () => {
    trackPromise(
      combineShards(k_thresh)
        .then((res) => {
          setSecret(res.data.combinedSecret);
          toast.success("Recombined Successfully!");
        })
        .catch((res) => {
          toast.failure(res.response.data.message);
        })
    );
  };
  const classes = useStyles();
  const part_textboxes = k_thresh.map((number, index) => (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name={"participants"}
      label={"participant " + (index + 1).toString() + "'s shard"}
      id={"participant " + (index + 1).toString()}
      onChange={(e) => handleChange(e, index)}
      defaultValue={""}
      key={index.toString()}
    />
  ));
  return (
    <Container>
      <Box display="flex" justifyContent="center" m={1} p={1}>
        <Typography variant="h4" gutterBottom>
          Recombine Shards
        </Typography>
      </Box>
      <div id="secret_texts">{part_textboxes}</div>

      <Button
        variant="outlined"
        color="primary"
        style={{ marginTop: "1rem" }}
        onClick={() => handleRegenerate()}
        id="generate"
      >
        Generate original Key
      </Button>
      {og_secret != "" ? <ShowSecret secret={og_secret} /> : <></>}
    </Container>
  );
}
