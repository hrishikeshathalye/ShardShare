import { React, useState, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Box, Container } from "@material-ui/core";
import { trackPromise } from 'react-promise-tracker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createSecret, deleteRequests } from '../../api/index';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop:'1rem',
    marginRight: theme.spacing(2)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

var formData = {
  secret_name: "",
  secret: "",
  n: "",
  k: "",
  participants: [],
  _id:""
};

function getSteps() {
  return [
    "Give Secret Name",
    "Enter Secret",
    "Enter (n,k) Threshhold",
    "Add Participants",
  ];
}

function getStepContent(step, handleChange) {
  if (Number(formData.n) === "")
    formData.participants = Array(Number(formData.n)).fill("");
  else{
    let originaln = formData.participants.length;
    for(let i = 0; i < parseInt(formData.n) - originaln; i++){
      formData.participants.push("");
    }
  }
  const part_textboxes = formData.participants.map((number, index) => (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name={"participants"}
      label={"participant" + index.toString() + "'s email"}
      id={"participant" + index.toString()}
      onChange={(e)=>handleChange(e, index)}
      defaultValue={formData.participants[index]}
      key={index.toString()}
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
      return <Box id="emails">{part_textboxes}</Box>;
    default:
      return "Unknown step";
  }
}
export default function HorizontalLinearStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const ref = useRef(0);
  const steps = getSteps();
  if(ref.current===0 && props.secret !== undefined){
    formData.secret_name = props.secret.secretName;
    formData.n = props.secret.n.toString();
    formData.k = props.secret.k.toString();
    formData._id = props.secret._id;
    formData.participants = [...(props.secret.sharedWith)];
    ref.current = 1;
  }
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
    if(activeStep === 3){
      if(ref.current === 1){
        trackPromise(
          deleteRequests(formData._id).then(res=>{
            toast.success("Deleted all pending requests on this secret.");
            trackPromise(createSecret(formData).then(res=>{
              toast.success("Sending emails successful! The secret has been reshared.")
            })).catch(()=>{
              toast.error("There was some error. Try again.")
            })
          }).catch(()=>{
            toast.error("There was some error. Try again.")
          })
        );
        ref.current = 0;
      }
      else{
        trackPromise(
          createSecret(formData).then(res=>{
            toast.success("Sending emails successful! The secret has been shared.")
          }).catch(()=>{
            toast.error("There was some error. Try again.")
          })
        );
      }
    }
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
  const handleChange = (e, index) => {
    if(e.target.name === "participants"){
      formData[e.target.name][index] = e.target.value;
    }
    else{
      formData[e.target.name] = e.target.value;
    }
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
            <Button variant="contained" color="secondary" onClick={handleReset} className={classes.button}>
              Reset
            </Button>
            <ToastContainer position="bottom-center"/>
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
