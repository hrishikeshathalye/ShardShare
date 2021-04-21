import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import HorizontalLinearStepper from "./stepper";
import { useHistory } from "react-router-dom";

export default function CreateSecretForm() {
  const history = useHistory();
  const secret = history.location?.state?.secret;
  return (
    <Container component="main" maxWidth="xs">
      <Box display="flex" justifyContent="center" m={1} p={1}>
        <Typography variant="h4" gutterBottom>
          Create New Secret
        </Typography>
      </Box>
      <HorizontalLinearStepper secret={secret} />
    </Container>
  );
}
