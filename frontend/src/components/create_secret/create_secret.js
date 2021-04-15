import React from "react";
import useStyles from "./styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import HorizontalLinearStepper from "./stepper";
import { useHistory } from 'react-router-dom';

export default function CreateSecretForm() {
  const classes = useStyles();
  const history = useHistory();
  const secret = history.location?.state?.secret;
  return (
    <Container component="main" maxWidth="xs">
      <Box
        display="flex"
        justifyContent="center"
        m={1}
        p={1}
        bgcolor="background.paper"
      >
      <Typography variant="h4" gutterBottom>
        Create New Secret
      </Typography>
      </Box>
      <HorizontalLinearStepper secret={secret}/>
    </Container>
  );
}
