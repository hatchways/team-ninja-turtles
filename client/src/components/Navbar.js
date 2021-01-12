import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import { Link } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.secondary
    },
    branchName: {
      flexGrow: 1,
      textTransform: 'uppercase'
    },
    navItems: {
        flexGrow: 2,
        textAlign:'right'
    }
}))

export default function Navbar() {
    const classes = useStyles()

    return (
        <AppBar position="static" className={classes.root}>
            <Toolbar>
                <Typography variant="h6" className={classes.branchName}>
                    Tattoo Art
                </Typography>
                <div className={classes.navItems}>
                    <Button color="inherit">Discover</Button>
                    <Button color="inherit">Messages</Button>
                    <Button color="inherit">Notifications</Button>
                    <Button component={Link} to={'/create-contest'} color="inherit">Create Contest</Button>
                    <Button color="inherit">Account</Button>
                </div>
            </Toolbar>
        </AppBar>
    )
}
