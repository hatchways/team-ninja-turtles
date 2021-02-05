import React, { useEffect, useState } from 'react'
import { MuiThemeProvider } from '@material-ui/core'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { theme } from "./themes/theme"
import NavBar from "./components/Navbar"
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProfilePage from './pages/Profile'
import CreateContestPage from './pages/CreateContest'
import SocketPage from './pages/SocketioConnection'
import SubmitDesignPage from './pages/SubmitDesign' 
import PaymentInfo from "./pages/PaymentInfo"
import ContestDetails from './pages/ContestDetails'
import EditProfilePage from "./pages/EditProfilePage"

import {getProfile} from "./apiCalls"

import './App.css'
import DiscoveryPage from './pages/DiscoveryPage'


export const UserContext = React.createContext();

function App() {
  // this default value avoids crashing for navbar and accessing private pages when not login, should be changed in the future
  const [user, setUser] = useState({username: "no-user", email: "", icon: process.env.PUBLIC_URL + '/images/avatar-1.png'})

  // load user context if the existing cookies hasnt expire
  useEffect(() => {
    getProfile((data) => {
        setUser({
          username: data.username,
          email: data.email,
          icon: data.icon == null ? process.env.PUBLIC_URL + '/images/avatar-1.png' : data.icon
        })
    }, (error) => {
        console.log("No valid user detected")
        // opt-out current user if it the token is  expired
        setUser({username: "no-user", email: "", icon: process.env.PUBLIC_URL + '/images/avatar-1.png'})
    })
}, [])

  return (
    <UserContext.Provider value={{user, setUser}}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <NavBar />
          <Switch>
            <Route path='/signup' component={Signup}></Route>
            <Route path='/login' component={Login}></Route>
            <Route path='/profile/:id' component={ProfilePage}></Route>
            <Route path='/contest-details/:id' component={ContestDetails}></Route>
            <Route path='/create-contest' component={CreateContestPage}></Route>
            <Route path='/submit-design/:id' component={SubmitDesignPage}></Route>
            <Route path='/message' component={SocketPage}></Route>
            <Route path="/add-card" component={PaymentInfo}></Route>
            <Route path="/edit-profile" component={EditProfilePage} />
            <Route path='/message/' component={SocketPage}></Route>
            <Route path='/' component={DiscoveryPage} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    </UserContext.Provider>
  )
}

export default App

