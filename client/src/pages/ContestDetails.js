import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import TabPanel from '../components/TabPanel'
import { 
    Button, 
    Typography, 
    Grid, 
    Tabs, 
    Tab, 
    Paper, 
    GridList, 
    GridListTile, 
    GridListTileBar 
} from '@material-ui/core'

import RequestError, { getContestDetails } from '../apiCalls'

const useStyles = makeStyles((theme) => ({
    pageContainer: {
        height: 'calc(100vh - 100px)',
    },
    containerWrapper: {
        width: '80vw',
        margin: '4rem auto'
    },
    backButton: {
        display: 'flex',
        flexDirection: 'row',
        opacity: '0.5',
        cursor: 'pointer'
    },
    backButtonIcon: {
        marginRight: '0.4rem'
    },
    backButtonText: {
        textDecoration: 'underline'
    },
    contestInfo: {
        margin: '2rem auto'
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    prizeAmount: {
        width: '4rem',
        textAlign: 'center',
        padding: '0.5rem',
        marginLeft: '0.5rem',
        color: '#fff',
        backgroundColor: '#000',
    },
    author: {
        marginTop: '0.5rem',
        display: 'flex',
        flexDirection: 'row',
        '& .MuiTypography-h5': {
            alignSelf: 'center',
            marginLeft: '1rem'
        }
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%'
    },
    submitButtonDiv: {
        textAlign: 'right'
    },
    submitDesign: {
        margin: '2rem auto',
        width: '15rem',
        height: '4rem',
        border: '2px solid',
        borderRadius: '0',
        '& .MuiButton-label': {
            fontWeight: 'bold'
        }
    },
    contestDesigns: {
        '& .MuiTab-fullWidth': {
            fontSize: '1.2rem'
        },
        '& .MuiTab-textColorInherit.Mui-selected': {
            fontWeight: 'bold'
        }
    }, 
    tabPanel: {
        '& .MuiBox-root': {
            margin: '2rem'
        }
    },
    noDataMessage: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        padding: '4rem'
    }
}))

export default function ContestDetails(props) {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(0)
    const [contest, setContest] = useState(null)
    const [gridListItems, setGridListItems] = useState(null)
    const contestId = props.match.params.id
    const history = useHistory()

    const handleTabChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab)
    }

    const onBackButtonClick = e => {
        history.push('/profile')
    }

    const getContestInfo = contestId => {
        getContestDetails(contestId, (data) => {
            console.log(data)
            data.title ? setContest(data) : setContest(null)
        },  (error) => {
            if (error instanceof RequestError && error.status === 400) {
                console.log(error.body)
            } else {
                console.log("unexpected error")
            }
        })
    }

    useEffect(() => {
        getContestInfo(contestId)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (contest) {
            if (contest.designs.length > 0) {
                const newGridListItems = contest.designs.map((design, index) => (
                    <GridListTile key={index}>
                        <img src={`${process.env.PUBLIC_URL}/images/${design.image}`} alt={design.image} />
                        <GridListTileBar title={`By @${design.author}`} />
                    </GridListTile>
                ))
    
                setGridListItems(newGridListItems)
            } else {
                const newGridListItems = <div>There is no designs to display</div>
                setGridListItems(newGridListItems)
            }
        }
    }, [contest])

   
    
    // temporary hard code contest information
    const contestInfo = {
        author: 'Kenneth Stewart',
        avatar: 'avatar-2.png',
        title: 'Lion tattoo concept in minimal style',
        description: 'Looking for cool simplicity ideas of lion',
        prizeAmount: '150'
    }

    return (
        contest !== null ? (
            <div className={classes.pageContainer}>
                <div className={classes.containerWrapper}>
                    <div className={classes.backButtonDiv}>
                        <div className={classes.backButton} onClick={onBackButtonClick}>
                            <Typography className={classes.backButtonIcon}>{`<`}</Typography>
                            <Typography className={classes.backButtonText}>Back to contests list</Typography>
                        </div>
                    </div>
                    <div className={classes.contestInfoDiv}>
                        <Grid container>
                            <Grid item xs={7} className={classes.contestInfo}>
                                <div className={classes.title}>
                                    <Typography variant='h4'>
                                        {contest.title}
                                    </Typography>
                                    <div className={classes.prizeAmount}>${contest.prize_contest}</div>
                                </div>
                                <div className={classes.author}>
                                    <img src={`${process.env.PUBLIC_URL}/images/avatar-${contest.contest_creater}.png`} alt='designer avatar' className={classes.avatar} />
                                    <Typography variant='h5'>{contest.creater_name}</Typography>
                                </div>
                            </Grid>
                            <Grid item xs={5} className={classes.submitButtonDiv}>
                                <Button variant='outlined' className={classes.submitDesign}>Submit Design</Button>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={classes.contestDesigns}>
                        <Paper>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant='fullWidth'
                                TabIndicatorProps={{ style: { background:'black' }}}
                            >
                                <Tab label='DESIGNS' />
                                <Tab label='BRIEF' />
                            </Tabs>
                            <TabPanel value={activeTab} index={0} className={classes.tabPanel}>
                                <GridList cellHeight={280} className={classes.gridList} cols={4} spacing={30}>
                                    {gridListItems}
                                </GridList>
                            </TabPanel>
                            <TabPanel value={activeTab} index={1}>
                                Tab 2
                            </TabPanel>
                        </Paper>
                    </div>
                </div>
            </div>
        ) : (
        <div className={classes.pageContainer}>
            <div className={classes.backButtonDiv}>
                    <div className={classes.backButton}>
                        <Typography className={classes.backButtonIcon}>{`<`}</Typography>
                        <Typography className={classes.backButtonText}>Back to contests list</Typography>
                    </div>
            </div>
            <div className={classes.noDataMessage}>
                Contest does not exist
            </div>
        </div>
        )
    )
}