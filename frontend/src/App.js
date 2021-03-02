import {React, useState, useEffect} from 'react';
// import logo from './logo.svg';
import './App.css';
import { Container } from '@material-ui/core';
import Home from "./components/Login/Landing/Landing"
import Navbar from "./components/Navbar/Nav"
import {Link, BrowserRouter, Switch, Route, useHistory} from 'react-router-dom'
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { verify } from './api/index';

function App() {
  let state = useSelector(state => state);
  const dispatch = useDispatch();
  let [isVerified, setVerified] = useState(null);
  useEffect(() => {
    verify().then((res)=>{
      setVerified(res.data.userId);
    }).catch(()=>{
      setVerified(null);
    });
  }, []);
  return (
    <BrowserRouter>
      <div className="main-container">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} /> :
          { isVerified ? 
            <Route exact path="/dashboard" component={Dashboard} /> :
            <Route exact path="/dashboard" component={Home} />
          }
          <Route exact path="/auth" component={Auth} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;