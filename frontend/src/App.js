import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Container } from '@material-ui/core';
import Home from "./components/Login/Home/Home"
import Navbar from "./components/Navbar/Nav"
import {Link, BrowserRouter, Switch, Route} from 'react-router-dom'
import Auth from './components/Auth/Auth';

function App() {
  return (
    <BrowserRouter>
      <div class="main-container">
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/auth" exact component={Auth} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;