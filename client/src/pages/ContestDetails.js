import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import TabPanel from '../components/TabPanel'
import CheckoutForm from '../components/CheckoutForm'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { 
    Button, 
    Typography, 
    Grid, 
    Tabs, 
    Tab, 
    Paper, 
    GridList, 
    GridListTile, 
    GridListTileBar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Radio,
} from '@material-ui/core'

import RequestError, { getContestDetails, checkStripeIDExists, createPayment } from '../apiCalls'

const stripePromise = loadStripe("pk_test_51IH8tAGt0nFBLozrVPDB6mwr6yEw9QOAVWhTQK0hErAcLv7F278Dz2f3P637jEaboOp7lJbAVnZNbQTxQUoqD91z00VxrG6s3T")
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
        textAlign: 'right',
        '& a': {
            textDecoration: 'none'
        }
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
    },
    designImage: {
        cursor: 'pointer'
    },
    dialog: {
        '& .MuiDialog-paper': {
            minWidth: '40vw'
        }
    },
    dialogImage: {
        width: '100%',
        height: '100%'
    },
    contestOverText: {
        color: 'red',
        backgroundColor: '#1f1f1f',
        fontSize: '1.5rem',
        padding: '1rem'
    },
    paymentDialog: {
        '& .MuiDialog-paper': {
            minWidth: '600px'
        }
    }
}))

export default function ContestDetails(props) {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(0)
    const [openDesignDialog, setOpenDesignDialog] = useState(false)
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
    const [contest, setContest] = useState(null)
    const [designOpening, setDesignOpening] = useState({})
    const [gridListItems, setGridListItems] = useState(null)
    const [submitButton, setSubmitButton] = useState(null)
    const [winningSubmission, setWinningSubmission] = useState(null)
    const [clientSecret, setClientSecret] = useState("")
    const contestId = props.match.params.id
    const history = useHistory()

    const handleTabChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab)
    }

    const handleClose = () => {
        setOpenDesignDialog(false);
    }

    const handlePaymentDialogClose = () => {
        setOpenPaymentDialog(false)
    }

    const handleWinnerChange = e => {
        setWinningSubmission(parseInt(e.target.value))
    }

    const onWinnerSubmit = async(e) => {
        checkStripeIDExists( // check if payment is set up before allow user submit a winner 
            (data) => {
                let intentSecret = data["intent_id"]
                if (intentSecret != null){
                    const amount = contest.prize_contest
                    const currency = 'usd'

                    createPayment(amount, currency, data => {
                        setClientSecret(data.client_secret)
                        setOpenPaymentDialog(true)
                    }, error => {   
                        console.log("unexpected error")
                    })
                } else {
                    alert("Please set up your payment before selecting a winner.")
                }
            },
            (error) => {
                alert("Please set up your payment before selecting a winner.")
            }
        )
    }
    const onBackButtonClick = e => {
        history.push('/profile')
    }

    const onDesignClick = e => {
        const index = e.target.id
        if (index) {
            setDesignOpening(contest.designs[index])
            setOpenDesignDialog(true)
        }
    }

    const getContestInfo = contestId => {
        getContestDetails(contestId, (data) => {
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
        //when payment dialog close, should fetch new data 
        getContestInfo(contestId)
    }, [openPaymentDialog, contestId])

    useEffect(() => {
        if (contest) {
            // Hide submit button when contest is over 
            if (contest.winner !== null) {
                setSubmitButton(null)
            }
            var newGridListItems = null
            if (contest.hasOwnProperty('is_owner')) { // If contest does not have property 'designs', that means it is not the contest owner accessing the page
                if (contest.designs.length > 0) { // Render this if it is the contest owner and there have been designs submitted
                    newGridListItems = contest.designs.map((design, index) => (
                        <GridListTile key={index}>
                            <img src={design.img} alt={design.image} id={index} onClick={onDesignClick} className={classes.designImage} />
                            <GridListTileBar title={`By @${design.creater}`}
                                actionIcon={
                                    <IconButton aria-label={`checkbox ${index}`}>
                                        <Radio
                                            checked={winningSubmission === design.submission_id}
                                            onChange={handleWinnerChange}
                                            value={design.submission_id}
                                            name={`radio_button_${index}`}
                                        />
                                    </IconButton>
                                }/>
                            </GridListTile>
                    ))
                    if (Date.parse(contest.deadline_date) < Date.now() && contest.winner == null) {
                        createSubmitWinnerButton()
                    }
                } else {
                    newGridListItems = <div>There is no images to display</div>
                }
            } else { // Render this if it is not the contest owner
                if (contest.attached_inspirational_images.length > 0) {
                    newGridListItems = contest.designs.map((design, index) => (
                        <GridListTile key={index}>
                            <img src={design.img} alt={design.image} id={index} onClick={onDesignClick} className={classes.designImage} />
                            <GridListTileBar title={`By @${design.creater}`}/>
                        </GridListTile>
                    ))
                } else {
                    newGridListItems = <div>There is no images to display</div>
                }
                if (Date.parse(contest.deadline_date) < Date.now() && contest.winner == null) {
                    createSubmitDesignButton()
                }
            }
            setGridListItems(newGridListItems)
        }
    }, [contest, winningSubmission])

    const createSubmitDesignButton = () => {
        setSubmitButton(
            <Link to={{
                    pathname: `/submit-design/${contestId}`
            }}>
                <Button variant='outlined' className={classes.submitDesign}>
                    Submit Design
                </Button>
            </Link>
        )
    }

    const createSubmitWinnerButton = () => {
        setSubmitButton(
            <Button variant='outlined' className={classes.submitDesign} onClick = {onWinnerSubmit}>
                Submit Winner
            </Button>
        )
    }

    return (
        contest !== null ? (
        <Elements stripe={stripePromise}>
            <div className={classes.pageContainer}>
                <div className={classes.containerWrapper}>
                    <Dialog open={openDesignDialog} onClose={handleClose} className={classes.dialog}>
                        <DialogTitle id="design-creater">
                            {`Designed by ${designOpening.creater}`}
                        </DialogTitle>
                        <DialogContent>
                            <img src={designOpening.img} alt={`designed created by ${designOpening.creater}`} className={classes.dialogImage} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Close</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openPaymentDialog} onClose={handlePaymentDialogClose} className={classes.paymentDialog}>
                        <DialogTitle>
                            Checkout Form 
                        </DialogTitle>
                        <DialogContent>
                            <CheckoutForm 
                                clientSecret={clientSecret} 
                                contestId={contestId} 
                                winningSubmission={winningSubmission}
                                setOpenPaymentDialog={setOpenPaymentDialog}
                            />
                        </DialogContent>
                    </Dialog>
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
                                {submitButton}
                            </Grid>
                        </Grid>
                    </div>
                    {contest.winner !== null ? <div className={classes.contestOverText}>This contest is over</div> : <div></div>}
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
        </Elements>
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