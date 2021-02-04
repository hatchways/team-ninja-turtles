import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    card: {
        display: 'flex',
        flexDirection: 'row',
        margin: '2.5rem auto 1.5rem 2rem'
    },
    imageWrapper: {
        width: '250px',
        height: '250px',
        position: 'relative'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    textBlock: {
        position: 'absolute',
        bottom: '0',
        width: '250px',
        height: '40px',
        color: 'white',
        paddingTop: '1rem',
        textAlign: 'center',
        backgroundImage: 'linear-gradient(to top,rgba(0,0,0,.7) 10%,rgba(0,0,0,0))'
    },
    info: {
        padding: '2rem 4rem'
    },
    title: {
        fontSize: '1.4rem',
        fontWeight: 'bold'
    },
    description: {
        fontSize: '1rem',
    },
    prizeAmount: {
        width: '8rem',
        textAlign: 'center',
        padding: '0.5rem',
        color: '#fff',
        backgroundColor: '#000',
        marginTop: '2rem'
    }
}))

export default function ContestCard({ image, noSketches, title, description, prizeAmount }) {
    const classes = useStyles()

    return (
        <div className={classes.card}>
            <div className={classes.imageWrapper}>
                <img src={image} alt='Tattoo contest' className={classes.image}/>
                <div>
                    <div className={classes.textBlock}>
                        <Typography>{noSketches} Sketches</Typography>
                    </div>
                </div>
            </div>

            <div className={classes.info}>
                <Typography className={classes.title}>{title}</Typography>
                <Typography className={classes.description}>{description}</Typography>
                <div>
                    <div className={classes.prizeAmount}>${prizeAmount}</div>
                </div>
            </div>
        </div>
    )
}
