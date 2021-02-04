import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography, Tabs, Tab, Paper } from '@material-ui/core'
import TabPanel from '../components/TabPanel'
import ContestCard from '../components/ContestCard'
import RequestError, { createRoom, getOwnedContests, getProfileOther } from '../apiCalls'
import { UserContext } from '../App'
import { useHistory, useParams } from 'react-router-dom'

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
    }, 
    messageButton: {
        '& .MuiButton-label': {
            fontWeight: 'bold'
        }, 
        marginLeft: '10px'
    }
}))

export default function Profile() {
    const classes = useStyles()
    const {user, setUser} = useContext(UserContext)
    const [profileUser, setProfileUser] = useState(null)
    const [activeTab, setActiveTab] = useState(0)
    const [contests, setContests] = useState([])    
    const [inProgressContestCards, getInProgressContestCards] = useState([])
    const [completedContestCards, getCompletedContestCards] = useState([])
    const [username, setUsername] = useState("")
    const [iconURL, setIconURL] = useState(process.env.PUBLIC_URL + 'images/avatar-1.png')
    const {id} = useParams()
    const history = useHistory()

    const handleTabChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab)
    }

    useEffect(() => { // Only runs once when first rendering
        if (id === user.username) {
            setContests(getOwnedContests(id, (data) => {
                setContests(data) // Sets contests equal to return from get request
            }, (error) => {
                // onError
                if (error instanceof RequestError && error.status === 400) {
                    console.log(error.body)
                } else {
                    console.log("unexpected error")
                }
            }))
        }
    }, [])

    useEffect(() => {
        if (user.username === id) {
            setProfileUser(user)
        } else {
            getProfileOther(id, (data) => {
                setProfileUser({
                    username: data.username, 
                    icon: data.icon ? data.icon : process.env.PUBLIC_URL + '/images/avatar-1.png'
                })
            }, (error) => {
                console.log("unexpected error")
            })
        }
    }, [user, id])

    useEffect(() => { 
        if (profileUser && profileUser.username) {
            setUsername(profileUser.username)
            setIconURL(profileUser.icon)
        }
    }, [profileUser])

    useEffect(() => { // Once get request returns a response, set contest cards
        try {
            console.log(contests)
            const inProgressContestCards = []
            const completedContestCards = []
            const contestsMap = new Map(Object.entries(contests))
            for (var i = 0; i < contestsMap.size; i++) {
                const contestName = 'contest_' + i
                const contest = new Map(Object.entries(contestsMap.get(contestName)))
                const deadlineDate = Date.parse(contest.get('deadline_date'))
                if (deadlineDate > Date.now()) {
                    pushContestCard(inProgressContestCards, contest, i)
                } else {
                    pushContestCard(completedContestCards, contest, i)
                }
            }
            getInProgressContestCards(inProgressContestCards)
            getCompletedContestCards(completedContestCards)
        } catch (error) {
            if (error instanceof TypeError) {
                // TODO: display "no ongoing contests"
            }
            console.log(error)
        }
    }, [contests])

    const sendMessage = () => {
        createRoom(id, (data) => {
            history.push({
                pathname: "/message",
                state: {
                    room: data
                }
            })
        }, (error) => {
            console.log("unexpected error")
        })
    }

    const editProfile = () => {
        history.push("/edit-profile")
    }

    const pushContestCard = (cardList, contest, i) => {
        cardList.push(
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

    return (
        <div className={classes.pageContainer}>
            <div className={classes.profileSection}>
                <img src={iconURL} alt='avatar' className={classes.avatar}/>
                <Typography className={classes.userName}>{username}</Typography>
            </div>
            <div className={classes.buttonDiv}>                
                {(user.username !== "no-user" && user.username !== id ? 
                    <Button className={classes.messageButton} variant='outlined' onClick={sendMessage}>
                        Send Message
                    </Button> 
                    : 
                    <Button className={classes.editButton} variant='outlined' onClick={editProfile}>
                        Edit Profile
                    </Button>
                )}   
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
