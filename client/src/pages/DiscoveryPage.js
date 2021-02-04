import React, { useEffect, useState } from  'react' 
import { makeStyles, createStyles, Theme } from  '@material-ui/core/styles'
import {
    Grid,
    Paper,
    TextField,
    Button
} from '@material-ui/core'
import DiscoveryContent from  '../components/DiscoveryContent'
import { getAllContest } from  '../apiCalls'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        marginTop: theme.spacing(5),
        flexGrow: 1,
    },
    pageTitle: {
        fontSize: '2rem',
        margin: '1rem',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    addLinkButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.87)',
        color: 'white',
        borderRadius: '0',
        padding: '1rem',
        marginLeft: '1rem',
        marginBottom: '1rem'
    },
    formContainer: {
        width: '85%',
        margin: 'auto'
    },
    paper: {
      height: 400,
      width: 400,
    }
  })
) 

const DiscoveryPage = () => {
    const classes = useStyles() 
    const [contests, setContests] = useState([]) 
    const [searchString, setSearchString] = useState("")

    const fetchContests = () => {
        getAllContest(searchString, (data) => {
            setContests(data)
        }, (error) => {
            console.log( 'Unexpected Error ')
            setContests([])
        })
    }

    const handleSearch = (event) => {
        fetchContests()
    }

    useEffect(() => {
        fetchContests()
    }, [])

    return (
        <form className={classes.formContainer}>
            <Grid container className={classes.root} spacing={1}>
                <Grid item xs={12} className={classes.pageTitle}>
                    All Ongoing Contests
                </Grid>
                <Grid container direction='row' container justify= 'center'>
                    <Grid item xs={5}>
                        <TextField 
                            id='search'
                            value={searchString}
                            onChange={(event) => setSearchString(event.target.value)}
                            label='Search'
                            fullWidth
                            variant='outlined'
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button className={classes.addLinkButton} fullWidth onClick={handleSearch} >Search</Button>
                    </Grid>
                </Grid>
                <Grid container justify= 'center' spacing={2}>
                    {contests.map((value, index) => (
                        <Grid key={index} item>
                            <Paper className={classes.paper}>
                                <DiscoveryContent
                                    img_src={value.img[0]}
                                    contest_name={value.name}
                                    creator_name={value.creator}
                                    prize={value.prize}
                                    date={value.date}
                                    desc={value.desc}
                                />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>       
        </form> 
    )
}

export default DiscoveryPage 