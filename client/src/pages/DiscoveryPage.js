import React, { useEffect, useState } from  'react' 
import { makeStyles, createStyles, Theme } from  '@material-ui/core/styles' 
import Grid from '@material-ui/core/Grid' 
import Paper from '@material-ui/core/Paper' 
import DiscoveryContent from  '../components/DiscoveryContent'
import { getAllContest } from  '../apiCalls'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(5),
      flexGrow: 1,
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

    useEffect(() => {
        getAllContest( (data) => {
            setContests(data)
        }, (error) => {
            console.log( 'Unexpected Error ')
            setContests([])
        })
    }, [])

    return (
        <Grid container className={classes.root} spacing={0}>
            <Grid item xs={12}>
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
        </Grid>        
    )
}

export default DiscoveryPage 