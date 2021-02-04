import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography, Tabs, Tab, Paper } from '@material-ui/core'
import TabPanel from '../components/TabPanel'
import ContestCard from '../components/ContestCard'
import RequestError, { createRoom, getOwnedContests, getProfileOther, getSubmittedContest } from '../apiCalls'
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
        },
        marginBottom:'2rem'
    }, 
    messageButton: {
        '& .MuiButton-label': {
            fontWeight: 'bold'
        }, 
        marginBottom:'2rem'
    }
}))

export default function Profile() {
    const classes = useStyles()
    const {user, setUser} = useContext(UserContext)
    const [profileUser, setProfileUser] = useState(null)
    const [activeTab, setActiveTab] = useState(0)
    const [contests, setContests] = useState([])   
    const [submitted, setSubmitted] = useState([]) 
    const [inProgressContestCards, setInProgressContestCards] = useState([])
    const [completedContestCards, setCompletedContestCards] = useState([])
    const [username, setUsername] = useState("")
    const [iconURL, setIconURL] = useState(process.env.PUBLIC_URL + 'images/avatar-1.png')
    const {id} = useParams()
    const history = useHistory()

    const handleTabChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab)
    }

    useEffect(() => { // Only runs once when first rendering
        getOwnedContests(id, (data) => {
            setContests(data) // Sets contests equal to return from get request
        }, (error) => {
            // onError
            if (error instanceof RequestError && error.status === 400) {
                console.log(error.body)
            } else {
                console.log("unexpected error")
            }
        })

        if (user.username !== "no-user" && user.username === id) {
            getSubmittedContest((data) => {
                setSubmitted(data)
            }, (error) => {
                console.log("unexpected error")
            })
        }
        
    }, [user, id])

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
            for (var i = 0; i < contests.length; i++) {
                const contest = contests[i]
                console.log(contest)
                const deadlineDate = Date.parse(contest.deadline)
                if (deadlineDate > Date.now()) {
                    pushContestCard(inProgressContestCards, contest, i)
                } else {
                    pushContestCard(completedContestCards, contest, i)
                }
            }

            setInProgressContestCards(inProgressContestCards)
            setCompletedContestCards(completedContestCards)
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
                    session: data
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
                id = {contest.id}
                image={contest.img[0]}
                noSketches={contest.img.length} 
                title={contest.title}
                description={contest.description}
                prizeAmount={contest.prize}
            />
        )
    }
    console.log(submitted)

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
                    {(  user.username !== "no-user" && user.username === id ?  
                        <Tab label="SUBMITTED"></Tab>
                        : null
                    )}
                </Tabs>
                <TabPanel id = {"in_progress_tab"} value={activeTab} index={0}>
                    {inProgressContestCards}
                </TabPanel>
                <TabPanel id = {"completed_tab"} value={activeTab} index={1}>
                    {completedContestCards}
                </TabPanel>

                {( user.username !== "no-user" && user.username === id ?  
                    <TabPanel id = {"submitted"} value={activeTab} index={1}>
                        {submitted.map((contest, index) => (
                            <ContestCard 
                                key={index}
                                id = {contest.id}
                                image={contest.img[0]}
                                noSketches={contest.img.length} 
                                title={contest.title}
                                description={contest.description}
                                prizeAmount={contest.prize}
                            />
                        ))}
                    </TabPanel> 
                    : null
                )}
            </Paper>
        </div>
    )
}
