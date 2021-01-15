import React from "react"
import { MuiThemeProvider } from "@material-ui/core"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { theme } from "./themes/theme"
import NavBar from "./components/Navbar"
import LandingPage from "./pages/Landing"
import CreateContestPage from "./pages/CreateContest"
import Login from "./pages/Login"
import "./App.css"

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/create-contest" component={CreateContestPage}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={LandingPage} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App
