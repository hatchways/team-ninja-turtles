import React from "react"
import { MuiThemeProvider } from "@material-ui/core"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { theme } from "./themes/theme"
import NavBar from "./components/Navbar"

import SignupPage from './pages/Signup'
import LoginPage from './pages/Login'
import LandingPage from "./pages/Landing"
import CreateContestPage from "./pages/CreateContest"
import SubmitDesignPage from "./pages/SubmitDesign" 

import "./App.css"

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/signup" component={SignupPage}></Route>
          <Route path="/login" component={LoginPage}></Route>
          <Route path="/create-contest" component={CreateContestPage}></Route>
          <Route path="/submit-design" component={SubmitDesignPage}></Route>
          <Route path="/" component={LandingPage} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App
