import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography, Tabs, Tab, Paper } from '@material-ui/core'
import TabPanel from '../components/TabPanel'
import ContestCard from '../components/ContestCard'

const useStyles = makeStyles((theme) => ({
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }, 
    profileSection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    contestSection: {
        width: '80vw',
        marginBottom: '4rem',
        '& .MuiTab-fullWidth': {
            fontSize: '1.2rem'
        },
        '& .MuiTab-textColorInherit.Mui-selected': {
            fontWeight: 'bold'
        }
    },
    avatar: {
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        marginTop: '4rem'
    },
    userName: {
        fontWeight: '600',
        fontSize: '2rem',
        margin: '1.5rem'
    },
    buttonDiv: {
        textAlign: 'center',
        margin: '0.5rem'
    },
    editButton: {
        '& .MuiButton-label': {
            fontWeight: 'bold'
        }
    }
}))

const tempData = [
    {
        image: 'tattoo-1.png',
        noSketches: '24',
        title: 'Lion tattoo concept in minimal style',
        description: 'Looking for cool simplicity ideas of lion',
        prizeAmount: '150'
    },
    {
        image: 'tattoo-3.png',
        noSketches: '24',
        title: 'Cat tattoo concept in minimal style',
        description: 'Looking for cool simplicity ideas of lion',
        prizeAmount: '200'
    },
    {
        image: 'tattoo-7.png',
        noSketches: '24',
        title: 'Lion tattoo concept in minimal style',
        description: 'Looking for cool simplicity ideas of lion',
        prizeAmount: '90'
    },
]

export default function Profile() {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(0)

    const handleTabChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab)
    }

    const inprogressContests = tempData.map((contest, index) => (
        <ContestCard 
            key={index}
            image={contest.image} 
            noSketches={contest.noSketches} 
            title={contest.title}
            description={contest.description}
            prizeAmount={contest.prizeAmount}
        />
    ))

    const completedContests = tempData.map((contest, index) => (
        <ContestCard 
            key={index}
            image={contest.image} 
            noSketches={contest.noSketches} 
            title={contest.title}
            description={contest.description}
            prizeAmount={contest.prizeAmount}
        />
    )).reverse()

    return (
        <div className={classes.pageContainer}>
            <div className={classes.profileSection}>
                <img src={process.env.PUBLIC_URL + 'images/avatar-1.png'} alt='avatar' className={classes.avatar}/>
                <Typography className={classes.userName}>Laurent Tang</Typography>
            </div>
            <div className={classes.buttonDiv}>
                <Button className={classes.editButton} variant='outlined'>
                    Edit Profile
                </Button>
            </div>
            <Paper className={classes.contestSection}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant='fullWidth'
                    TabIndicatorProps={{ style: { background:'black' }}}
                >
                    <Tab label='IN PROGRESS' />
                    <Tab label='COMPLETED' />
                </Tabs>
                <TabPanel value={activeTab} index={0}>
                    {inprogressContests}
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    {completedContests}
                </TabPanel>
            </Paper>
        </div>
    )
}
