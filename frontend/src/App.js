import { React, useState, useEffect } from "react";
// import logo from './logo.svg';
import "./App.css";
import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Home from "./components/Login/Landing/Landing";
import Navbar from "./components/Navbar/Nav";
import CreateSecretForm from "./components/create_secret/create_secret";
import {
  Link,
  BrowserRouter,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Dashboard from "./components/Dashboard/Dashboard";
import SharedWithUser from "./components/SharedWithUser/SharedWithUser";
import SharedByUser from "./components/SharedByUser/SharedByUser";
import RecoveryRequests from "./components/RecoveryRequests/RecoveryRequests";
import { useDispatch, useSelector } from "react-redux";
import { verify } from "./api/index";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));
const renderRoutes = (isVerified) => {
  if (isVerified)
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/create_context" component={CreateSecretForm} />
        <Route exact path="/auth" component={Dashboard} />
      </Switch>
    );
  else
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/dashboard" component={Home} />
        <Route exact path="/create_context" component={Home} />
        <Route exact path="/auth" component={Home} />
      </Switch>
    );
};
function App() {
  const classes = useStyles();
  let state = useSelector((state) => state);
  const dispatch = useDispatch();
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
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Navbar />
          </Grid>
          <Grid item xs={12}>
            <Switch>
              <Route exact path="/" component={Home} />
              {isVerified ? (
                <Route exact path="/dashboard" component={Dashboard} />
              ) : (
                <Route exact path="/dashboard" component={Home} />
              )}
              <Route exact path="/auth" component={Auth} />
              <Route exact path="/create_secret" component={CreateSecretForm} />
              <Route exact path="/sharedbyyou" component={SharedByUser} />
              <Route exact path="/sharedwithyou" component={SharedWithUser} />
              <Route
                exact
                path="/recoveryrequests"
                component={RecoveryRequests}
              />
            </Switch>
          </Grid>
        </Grid>
      </div>
    </BrowserRouter>
  );
}

export default App;
