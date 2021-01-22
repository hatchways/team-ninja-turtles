import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DiscoveryContent from "../components/DiscoveryContent"
import { getAllContest } from "../apiCalls"


const mockData = [{
    ind: 0,
    img: "https://lh6.ggpht.com/HlgucZ0ylJAfZgusynnUwxNIgIp5htNhShF559x3dRXiuy_UdP3UQVLYW6c=s1200",
    name: "lorem ipsum",
    creator: "John Doe",
    prize: 5000.00,
    date: "2022-01-03"
}, {
    ind: 1,
    img: "https://artignite.files.wordpress.com/2017/09/p_20170918_143901_vhdr_on1.jpg",
    name: "dolor sit amet",
    creator: "Josh Stick",
    prize: 3.50,
    date: "2023-05-01"
}, {
    ind: 2,
    img: "https://cdn.mos.cms.futurecdn.net/jbCNvTM4gwr2qV8X8fW3ZB.png",
    name: "consectetur adipiscing elit",
    creator: "Joe Bloggs",
    prize: 20.01,
    date: "2044-12-03"
}, {
    ind: 3,
    img: "https://artlogic-res.cloudinary.com/w_1200,c_limit,f_auto,fl_lossy,q_auto/ws-gibsonfineart/usr/images/exhibitions/main_image_override/109/tequila-sunrise.jpeg",
    name: "sed do eiusmod",
    creator: "Jane Doe",
    prize: 15000.33,
    date: "2022-12-31"
}, {
    ind: 4, 
    img: "https://fluid-painting.com/wp-content/uploads/2020/02/resin-art.jpg",
    name: "tempor incididunt",
    creator: "Dylan Mann",
    prize: 2700.44,
    date: "2021-03-03"
}, {
    ind: 5,
    img: "https://cdn.britannica.com/80/129380-131-A57EAB51/Art-texture-Close-up-painting-blog-history-entertainment-2009.jpg",
    name: "ut labore et dolore magna aliqua",
    creator: "Sue Downs",
    prize: 7732.13,
    date: "2022-01-03"
}, {
    ind: 6,
    img: "https://ocadu.ca/sites/default/files/inline-images/painting-coronavirus/Ilene%20Angel%20C.jpeg",
    name: "Ut enim ad minim veniam, quis nostrud exercitation",
    creator: "Chaplain Mondover",
    prize: 0,
    date: "2022-01-03"
}, {
    ind: 7,
    img: "https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/image-bgEuwDxel93-Pg-large_1.png",
    name: "sed do eiusmod tempor",
    creator: "Kevin Fever",
    prize: 99.99,
    date: "2022-01-03"
}];

const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

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
);

const DiscoveryPage = () => {
    const classes = useStyles();
    const [contests, setContests] = useState([]);

    useEffect(() => {
        getAllContest( (data) => {
            setContests(data)
        }, (error) => {
            console.log("Unexpected Error")
        })
    }, [])

    console.log(contests)
    return (
        <Grid container className={classes.root} spacing={0}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={2}>
                    {contests.map((value) => (
                        <Grid key={value.ind} item>
                            <Paper className={classes.paper}>
                                <DiscoveryContent
                                    img_src={mockData[Math.floor(Math.random() * mockData.length)].img}
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

export default DiscoveryPage;