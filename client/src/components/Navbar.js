import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Typography, Button, Toolbar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { getProfile } from '../apiCalls'
import {UserContext} from '../App'

const useStyles = makeStyles((theme) => ({
    appBar: {
      flexGrow: 1,
      backgroundColor: theme.secondary,
      position: "sticky",
      top:0
    },
    toolBar: {
        height: '100px',
        margin: 'auto 4rem'
    },
    branchName: {
      textDecoration: 'none',
      color: '#fff',
      flexGrow: 1,
      fontSize: '1.5rem',
      textTransform: 'uppercase',
      letterSpacing: '8px'
    },
    navItems: {
        flexGrow: 2,
        textAlign:'right',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    navItem: {
        margin: 'auto 1.5rem',
        fontSize: '1rem',
        textTransform: 'none'
    },
    createContestLink: {
        margin: 'auto 2rem',
        '& .MuiButton-label': {
            padding: '0.5rem 1.5rem'
        }
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%'
    },
    accountLink: {
        marginLeft: '1.5rem',
        fontSize: '1rem',
        textTransform: 'none'
    }
}))

export default function Navbar() {
    const classes = useStyles()
    const {user, setUser} = useContext(UserContext);

    return (
        <AppBar position='static' className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
                <Typography
                    component={Link} to={'/'}
                    variant='h6'
                    className={classes.branchName}
                >
                    Tattoo Art
                </Typography>
                <div className={classes.navItems}>
                    <Button
                        component={Link} to={'/'} 
                        color='inherit'
                        className={classes.navItem}
                    >
                        Discover
                    </Button>
                    <Button
                        component={Link} to={'/message'} 
                        color='inherit'
                        className={classes.navItem}
                    >
                        Messages
                    </Button>
                    {/* <Button
                        component={Link} to={'/notifications'} 
                        color='inherit'
                        className={classes.navItem}
                    >
                        Notifications
                    </Button> */}
                    <Button 
                        component={Link} to={'/create-contest'} 
                        color='inherit' 
                        className={classes.createContestLink} 
                        variant='outlined'
                    >
                        Create Contest
                    </Button>
                    <img src={user.icon} alt='avatar' className={classes.avatar}/>
                    <Button
                        component={Link} to={'/profile'} 
                        color='inherit'
                        className={classes.accountLink}
                    >
                        Account
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    )
}
