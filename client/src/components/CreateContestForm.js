import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
    Grid,
    TextField,
    Typography,
    Select,
    InputAdornment,
    MenuItem,
    Box,
    Button,
    GridList,
    GridListTile
} from '@material-ui/core'

import RequestError, { createContest, getInspirationalImages } from '../apiCalls'

const useStyles = makeStyles((theme) => ({
    formContainer: {
        width: '70%',
        margin: 'auto',
    },
    inputMargin: {
        marginTop: '0.5rem',
    },
    label: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        paddingTop: '3rem'
    },
    description: {
        minHeight: '8rem'
    },
    prizeInput: {
        textAlign: 'right'
    },
    tattooImages: {
        marginTop: '1.5rem',
        border: '1px solid #efebe9',
        maxHeight: '500px',
        overflow: 'scroll'
    },
    gridList: {
        padding: '2rem'
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'center'
    },
    submitButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.87)',
        color: 'white',
        borderRadius: '0',
        padding: '1rem',
        margin: '5rem',
    },
    borderedDiv: {
        width: '100%',
        height: '100%',
        border: '1px solid #efebe9',
        display: 'flex',
        alignItems: 'center',
    }
}))

export default function CreateContestForm() {
    const classes = useStyles()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState(new Date().toISOString().substr(0,10))
    const [time, setTime] = useState(new Date().toTimeString().substr(0,5))
    const [timeZone, setTimeZone] = useState('PDT')
    const [inspirationalImages, setImages] = useState([])
    const [amountError, setAmountError] = useState(false)
    const [amountHelperText, setAmountHelperText] = useState('')

    const onAmountChange = e => {
        if (e.target.value < 0) {
            setAmountError(true)
            setAmountHelperText('Invalid input')
        } else {
            setAmount(e.target.value)
            setAmountError(false)
            setAmountHelperText('')
        }
    }

    const onSubmit = () => {
        const deadline = new Date(date.replace(/-/g, '\/'))
        const hours = time.substr(0,2)
        const minutes = time.substr(3, 5)
        deadline.setHours(hours)
        deadline.setMinutes(minutes)
        const contestCreator = 1

        createContest(title, description, amount, deadline, contestCreator, data => {
            console.log('contest has been successfully created!')
        }, error => {
            if (error instanceof RequestError && error.status === 400) {
                console.log(error.body)
            } else {
                console.log("unexpected error")
            }
        })
    }
    useEffect(() => { // Only runs once when first rendering
        getInspirationalImages(createGridListTiles, // Sets images equal to return from get request
            (error) => {
            // onError
            if (error instanceof RequestError && error.response.status === 400) {
                console.log(error.response.json())
            } else {
                console.log(error)
            }
        })
    }, [])
    const createGridListTiles = (data) => {
        const imagesMap = new Map(Object.entries(data))
        console.log(imagesMap)
        const images = []
        for (var i = 0; i < imagesMap.size; i++) {
            const imageMap = new Map(Object.entries(imagesMap.get(String(i))))
            const imageURL = imageMap.get('image_link')
            const imageKey = imageMap.get('id')
            images.push(
                <GridListTile key={imageKey} cols={1}>
                    <img src={imageURL} alt={imageURL} />
                </GridListTile>
                )
        }
        setImages(images)
    }
    return (
        <form className={classes.formContainer}>
            <Grid container direction='row'>
                <Grid item xs={12}>
                    <Typography className={classes.label}>What do you need designed?</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        id='title'
                        className={classes.inputMargin}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        label='Write a descriptive contest title'
                        fullWidth
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.label}>Description</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        id='description'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className={classes.inputMargin}
                        label='Details about what type of tattoo you want'
                        fullWidth
                        multiline
                        rows={8}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography className={classes.label}>Prize Amount</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography className={classes.label}>Deadline</Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField 
                        id='amount'
                        value={amount}
                        error={amountError}
                        helperText={amountHelperText}
                        onChange={onAmountChange}
                        className={classes.inputMargin}
                        type='number'
                        InputProps={{
                            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                            style: { textAlign: 'right' },
                        }}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={3}>
                    <div className={classes.borderedDiv}>
                        <TextField
                            id='deadlineDate'
                            inputProps={{ style: { padding: '1rem' } }}
                            InputProps={{ disableUnderline: true }}
                            type='date'
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            fullWidth
                        />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className={classes.borderedDiv}>
                        <TextField
                            id='deadlineTime'
                            type='time'
                            inputProps={{ style: { padding: '1rem' } }}
                            InputProps={{ disableUnderline: true }}
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            fullWidth
                        />
                    </div>
                </Grid>
                <Grid item xs={2}>
                    <div className={classes.borderedDiv}>
                        <Select
                            id='timezoneSelect'
                            value={timeZone}
                            fullWidth
                            disableUnderline
                            style={{ padding: '1rem' }}
                            onChange={e => setTimeZone(e.target.value)}
                        >
                            <MenuItem value='EST'>EST</MenuItem>
                            <MenuItem value='PDT'>PDT</MenuItem>
                            <MenuItem value='ICT'>ICT</MenuItem>
                            <MenuItem value='WET'>WET</MenuItem>
                        </Select>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.label}>Which designs do you like?</Typography>
                    <Typography>Let's start by helping your desingers understand which styles you prefer.</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Box className={classes.tattooImages}>
                        <GridList cellHeight={160} className={classes.gridList} cols={4}>
                            {inspirationalImages}
                        </GridList>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box className={classes.buttonWrapper}>
                        <Button className={classes.submitButton} onClick={onSubmit}>Create Contest</Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    )
}
