import React from 'react'
import { Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CreateContestForm from '../components/CreateContestForm'

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