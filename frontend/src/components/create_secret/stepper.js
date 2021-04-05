import { React, useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Box, Container } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    "Give Secret Name",
    "Enter Secret",
    "Enter (n,k) Threshhold",
    "Add Participants",
  ];
}

function getStepContent(step, handleChange) {
  if (Number(formData.n) != 0)
    formData.participants = Array(Number(formData.n)).fill("");
  const part_textboxes = formData.participants.map((number) => (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name={"participant"}
      label={"participant" + number.toString() + "'s email"}
      id={"participant" + number.toString()}
      onChange={handleChange}
      defaultValue={""}
      key={number.toString()}
    />
  ));
  switch (step) {
    case 0:
      return (
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="secret_name"
          label="Secret Name"
          name="secret_name"
          autoFocus
          onChange={handleChange}
          defaultValue={formData.secret_name}
        />
      );
    case 1:
      return (
        <div>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="secret"
            label="Secret"
            type="password"
            id="secret"
            onChange={handleChange}
            defaultValue={formData.secret}
          />
        </div>
      );
    case 2:
      return (
        <Container>
          <div>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="n"
              label="n"
              id="n"
              onChange={handleChange}
              defaultValue={formData.n}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="k"
              label="k"
              id="k"
              onChange={handleChange}
              defaultValue={formData.k}
            />
          </div>
        </Container>
      );
    case 3:
      return <Box>{part_textboxes}</Box>;
    default:
      return "Unknown step";
  }
}
var formData = {
  secret_name: "",
  secret: "",
  n: "",
  k: "",
  participants: [],
};
export default function HorizontalLinearStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const [skipped, setSkipped] = useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const handleChange = (e) => {
    formData[e.target.name] = e.target.value;
    console.log(formData);
  };
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep, handleChange)}

            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}