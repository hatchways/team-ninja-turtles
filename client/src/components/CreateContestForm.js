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
        marginTop: "1.5rem",
        border: "1px solid #efebe9",
        maxHeight: "500px",
        overflow: "scroll"
    },
    gridList: {
        padding: "2rem"
    },
    buttonWrapper: {
        display: "flex",
        justifyContent: "center"
    },
    submitButton: {
        backgroundColor: "rgba(0, 0, 0, 0.87)",
        color: "white",
        borderRadius: "0",
        padding: "1rem",
        margin: "5rem",
    },
    borderedDiv: {
        width: "100%",
        height: "100%",
        border: "1px solid #efebe9",
        display: "flex",
        alignItems: "center",
    }
}))

export default function CreateContestForm() {
    const classes = useStyles()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [timeZone, setTimeZone] = useState('PDT')
    const [images, setImages] = useState('')
    const [amountError, setAmountError] = useState(false)
    const [amountHelperText, setAmountHelperText] = useState('')

    const onAmountChange = e => {
        if (e.target.value < 0) {
            setAmountError(true)
            setAmountHelperText("Invalid input")
        } else {
            setAmount(e.target.value)
            setAmountError(false)
            setAmountHelperText('')
        }
    }

    // temporary hardcode image names
    const imageNames = ['tattoo-1.png', 'tattoo-2.png', 'tattoo-3.png', 'tattoo-4.png', 'tattoo-5.png', 
    'tattoo-6.png', 'tattoo-7.png', 'tattoo-8.png', 'tattoo-9.png', 'tattoo-10.png', 
    'tattoo-11.png', 'tattoo-12.png']

    return (
        <form className={classes.formContainer}>
            <Grid container direction="row">
                <Grid item xs={12}>
                    <Typography className={classes.label}>What do you need designed?</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        id="title"
                        className={classes.inputMargin}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        label="Write a descriptive contest title"
                        fullWidth
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.label}>Description</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className={classes.inputMargin}
                        label="Details about what type of tattoo you want"
                        fullWidth
                        multiline
                        rows={8}
                        variant="outlined"
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
                        id="amount"
                        value={amount}
                        error={amountError}
                        helperText={amountHelperText}
                        onChange={onAmountChange}
                        className={classes.inputMargin}
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            // endAdornment: <InputAdornment position="end">.00</InputAdornment>,
                            style: {textAlign: 'right'},
                        }}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={3}>
                    <div className={classes.borderedDiv}>
                        <TextField
                            id="deadlineDate"
                            defaultValue="2021-01-12"
                            inputProps={{ style: { padding: "1rem" } }}
                            InputProps={{ disableUnderline: true }}
                            type="date"
                            fullWidth
                        />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className={classes.borderedDiv}>
                        <TextField
                            id="deadlineTime"
                            type="time"
                            inputProps={{ style: { padding: "1rem" } }}
                            InputProps={{disableUnderline: true}}
                            defaultValue="13:00"
                            fullWidth
                        />
                    </div>
                </Grid>
                <Grid item xs={2}>
                    <div className={classes.borderedDiv}>
                        <Select
                            id="timezoneSelect"
                            value={timeZone}
                            fullWidth
                            disableUnderline
                            style={{ padding: "1rem" }}
                            onChange={e => setTimeZone(e.target.value)}
                        >
                            <MenuItem value="EST">EST</MenuItem>
                            <MenuItem value="PDT">PDT</MenuItem>
                            <MenuItem value="ICT">ICT</MenuItem>
                            <MenuItem value="WET">WET</MenuItem>
                        </Select>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.label}>Which designs do you like?</Typography>
                    <Typography>Let's start by helping your desingers understand which styles you prefer.</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Box className={classes.tattoosImages}>
                        <GridList cellHeight={160} className={classes.gridList} cols={4}>
                            {imageNames.map((image, index) => (
                                <GridListTile key={index} cols={1}>
                                    <img src={process.env.PUBLIC_URL + "/images/" + image} alt={image} />
                                </GridListTile>
                            ))}
                        </GridList>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box className={classes.buttonWrapper}>
                        <Button className={classes.submitButton}>Create Contest</Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    )
}
