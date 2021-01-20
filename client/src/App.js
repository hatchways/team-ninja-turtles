import React from 'react'
import { MuiThemeProvider } from '@material-ui/core'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { theme } from "./themes/theme"
import NavBar from "./components/Navbar"
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProfilePage from './pages/Profile'
import LandingPage from './pages/Landing'
import CreateContestPage from './pages/CreateContest'
import SubmitDesignPage from './pages/SubmitDesign' 
import PaymentInfo from "./pages/PaymentInfo"

import './App.css'

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <NavBar />
        <Switch>
          <Route path='/signup' component={Signup}></Route>
          <Route path='/login' component={Login}></Route>
          <Route path='/profile' component={ProfilePage}></Route>
          <Route path='/create-contest' component={CreateContestPage}></Route>
          <Route path='/submit-design' component={SubmitDesignPage}></Route>
          <Route path='/' component={LandingPage} />
          <Route path="/add_card" component={PaymentInfo} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  )
}

export default App
