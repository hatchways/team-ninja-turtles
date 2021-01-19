import React, { useState, useEffect } from 'react'
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

const useStyles = makeStyles((theme) => ({
    pageContainer: {
        height: 'calc(100vh - 100px)',
    },
    containerWrapper: {
        width: '80vw',
        margin: '4rem auto'
    },
    backButtonDiv: {
       
    },
    backButton: {
        display: 'flex',
        flexDirection: 'row',
        opacity: '0.5'
    },
    backButtonIcon: {
        marginRight: '0.4rem'
    },
    backButtonText: {
        textDecoration: 'underLine'
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
    gridList: {

    }
}))

const tempData = [
    {
        image: 'tattoo-1.png',
        author: 'jesse'
    },
    {
        image: 'tattoo-2.png',
        author: 'anthony'
    },
    {
        image: 'tattoo-3.png',
        author: 'denise'
    },
    {
        image: 'tattoo-4.png',
        author: 'james'
    },
    {
        image: 'tattoo-5.png',
        author: 'jesse'
    },
    {
        image: 'tattoo-6.png',
        author: 'anthony'
    },
    {
        image: 'tattoo-7.png',
        author: 'james'
    },
    {
        image: 'tattoo-8.png',
        author: 'james'
    },
    {
        image: 'tattoo-9.png',
        author: 'denise'
    },
    {
        image: 'tattoo-10.png',
        author: 'jesse'
    },
    {
        image: 'tattoo-11.png',
        author: 'denise'
    },
    {
        image: 'tattoo-12.png',
        author: 'jesse'
    },
]

export default function ContestDetails() {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(0)

    const handleTabChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab)
    }
    
    // temporary hard code contest information
    const contestInfo = {
        author: 'Kenneth Stewart',
        avatar: 'avatar-2.png',
        title: 'Lion tattoo concept in minimal style',
        description: 'Looking for cool simplicity ideas of lion',
        prizeAmount: '150'
    }

    const gridListItems = tempData.map((item, index) => (
        <GridListTile key={index}>
            <img src={`${process.env.PUBLIC_URL}/images/${item.image}`} alt={item.image} />
            <GridListTileBar title={`By @${item.author}`} />
        </GridListTile>
    ))

    return (
        <div className={classes.pageContainer}>
            <div className={classes.containerWrapper}>
                <div className={classes.backButtonDiv}>
                    <div className={classes.backButton}>
                        <Typography className={classes.backButtonIcon}>{`<`}</Typography>
                        <Typography className={classes.backButtonText}>Back to contests list</Typography>
                    </div>
                </div>
                <div className={classes.contestInfoDiv}>
                    <Grid container>
                        <Grid item xs={7} className={classes.contestInfo}>
                            <div className={classes.title}>
                                <Typography variant='h4'>
                                    {contestInfo.title}
                                </Typography>
                                <div className={classes.prizeAmount}>${contestInfo.prizeAmount}</div>
                            </div>
                            <div className={classes.author}>
                                <img src={`${process.env.PUBLIC_URL}/images/${contestInfo.avatar}`} alt="designer avatar" className={classes.avatar} />
                                <Typography variant='h5'>{contestInfo.author}</Typography>
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
    )
}