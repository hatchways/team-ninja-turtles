import React, { useContext, useEffect } from 'react'
import { Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CreateContestForm from '../components/CreateContestForm'
import { UserContext } from '../App'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    pageContainer: {
        width: '100vw'
    },
    pageTitle: {
        fontSize: '2rem',
        margin: '4rem',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    paper: {
        marginBottom: '2rem'
    }
})) 

export default function CreateContest() {
    const classes = useStyles()
    const {user, setUser} = useContext(UserContext)

    useEffect(() => {
        if (user.username === "no-user") {
            return (
            <Redirect to='/login'/>
            )
        }
    }, [user])

    return (
        <Grid container justify='center' className={classes.pageContainer}>
            <Grid item xs={12} className={classes.pageTitle}>
                Create New Contest
            </Grid>
            <Grid item xs={8}>
                <Paper className={classes.paper}>
                    <CreateContestForm />
                </Paper>
            </Grid>
        </Grid>
    )
}