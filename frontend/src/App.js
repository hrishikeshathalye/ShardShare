import { React, useState, useEffect } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Home from "./components/Login/Landing/Landing";
import Navbar from "./components/Navbar/Nav";
import CreateSecretForm from "./components/create_secret/create_secret";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Dashboard from "./components/Dashboard/Dashboard";
import SharedWithUser from "./components/SharedWithUser/SharedWithUser";
import SharedByUser from "./components/SharedByUser/SharedByUser";
import RecoveryRequests from "./components/RecoveryRequests/RecoveryRequests";
import RecoverSecret from "./components/RecoverSecret/RecoverSecret";
import Loader from "react-loader-spinner";
import { usePromiseTracker } from "react-promise-tracker";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { verify } from "./api/index";

toast.configure();

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && (
      <div
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position:"fixed",
          zIndex:1
        }}
      >
        <div
          style={{
            position: "absolute",
            backdropFilter: "blur(6px)",
            background: "rgba(255,255,255,0.5)",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader type="TailSpin" color="#000000" width="100" height="100" />
        </div>
      </div>
    )
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  let [isVerified, setVerified] = useState(null);
  useEffect(() => {
    verify()
      .then((res) => {
        setVerified(res.data.userId);
      })
      .catch(() => {
        setVerified(null);
      });
  }, []);
  return (
    <BrowserRouter>
      <Navbar />
      <LoadingIndicator />
      <ToastContainer position="bottom-center" />
        {isVerified ? (
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route
              exact
              path="/create_secret"
              component={CreateSecretForm}
            />
            <Route exact path="/sharedbyyou" component={SharedByUser} />
            <Route exact path="/sharedwithyou" component={SharedWithUser} />
            <Route
              exact
              path="/recoveryrequests"
              component={RecoveryRequests}
            />
            <Route exact path="/recombine/:k" component={RecoverSecret} />
            <Route path="/" component={Dashboard} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/auth" component={Auth} />
            <Route path="/" component={Home} />
          </Switch>
        )}
    </BrowserRouter>
  );
}

export default App;
