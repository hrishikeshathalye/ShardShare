import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";
import { combineShards } from "../../api/index";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import ShowSecret from "./ShowSecret";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  media: {
    height: 140,
  },
});

export default function RecoverSecret(props) {
  const [k, setk] = useState(props.match.params.k);
  var [og_secret, setSecret] = useState("");
  const k_thresh = useRef([]);
  if(k_thresh.current.length === 0){
    for (let i = 0; i < k; i++) {
      k_thresh.current.push("");
    }
  }
  const handleChange = (e, index) => {
    k_thresh.current[index] = e.target.value;
  };
  const handleRegenerate = () => {
    trackPromise(
      combineShards(k_thresh.current)
        .then((res) => {
          setSecret(res.data.combinedSecret);
          toast.success(res.data.message);
        })
        .catch((res) => {
          toast.error(res.response.data.message);
        })
    );
  };
  const classes = useStyles();
  const part_textboxes = k_thresh.current.map((number, index) => (
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
