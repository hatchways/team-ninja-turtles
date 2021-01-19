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

const user_id = 1
const hostname = "http://localhost:5000"

export default function Profile() {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(0)
    const [inProgressContestCards, getInProgressContestCards] = useState([])
    const [completedContestCards, getCompletedContestCards] = useState([])

    const handleTabChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab)
    }
    useEffect(() => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', hostname + '/contests/owned/' + user_id)

        xhr.onload = () => {
            const inProgressContestCards = []
            const completedContestCards = []
            const contests = new Map(Object.entries(JSON.parse(xhr.response)))
            for(var i = 0; i < contests.size; i++) {
                const contest_name = 'contest_' + i
                const contest = new Map(Object.entries(contests.get(contest_name)))
                const deadline_date = Date.parse(contest.get('deadline_date'))
                if(deadline_date > Date.now()) {
                    inProgressContestCards.push(
                        <ContestCard 
                            key={i}
                            image='tattoo-3.png'
                            noSketches='24' 
                            title={contest.get('title')}
                            description={contest.get('description')}
                            prizeAmount={contest.get('prize_contest')}
                        />
                    )
                } else {
                    completedContestCards.push(
                        <ContestCard 
                            key={i}
                            image='tattoo-2.png'
                            noSketches='24' 
                            title={contest.get('title')}
                            description={contest.get('description')}
                            prizeAmount={contest.get('prize_contest')}
                        />
                    )
                }
            }
            getInProgressContestCards(inProgressContestCards)
            getCompletedContestCards(completedContestCards)
        }
        xhr.send()
    }, [])

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
                    id="tabs"
                    value={activeTab}
                    onChange={handleTabChange}
                    variant='fullWidth'
                    TabIndicatorProps={{ style: { background:'black' }}}
                >
                    <Tab label='IN PROGRESS' />
                    <Tab label='COMPLETED' />
                </Tabs>
                <TabPanel id = {"in_progress_tab"} value={activeTab} index={0}>
                    {inProgressContestCards}
                </TabPanel>
                <TabPanel id = {"completed_tab"} value={activeTab} index={1}>
                    {completedContestCards}
                </TabPanel>
            </Paper>
        </div>
    )
}
