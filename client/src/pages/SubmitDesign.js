import React from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Paper, Typography, Button, Box } from '@material-ui/core'
import { useDropzone } from 'react-dropzone'

const useStyles = makeStyles((theme) => ({
    pageContainer: {
        width: '100vw',
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    paper: {
        width: '60vw',
        minHeight: '30vw',
        marginTop: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    pageTitle: {
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    uploadButton: {
        width: '10rem',
        height: '10rem',
        borderRadius: '3.5rem',
        backgroundColor: '#F4F5FC'
    },
    image: {
        width: '50%'
    },
    boldText: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
    },
    instructionDiv: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.87)',
        color: 'white',
        borderRadius: '0',
        padding: '1.5rem 5rem',
        margin: '5rem',
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'center'
    },
}))

export default function SubmitDesign(props) {
    const history = useHistory()
    const classes = useStyles()
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/jpeg, image/png, img/gif',
        maxFiles: 10
    })
    const contestId = props.location.contestId

    const acceptedFileItems = acceptedFiles.map((file, index)  => (
        <div key={index}>
            <h4>Upload success</h4>
            <li key={file.path}>
                {file.path} - {file.size} bytes
            </li>
        </div>
    ))
    
    const fileRejectionItems = fileRejections.map(({ file, errors }, index) => (
        <div key={index}>
            <h4>Upload failed</h4>
            Fail to upload {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </div>
    ))

    const handleUpload = () => {
        if (contestId) { 
            const data = new FormData();
            data.append('file', acceptedFiles[0]);
            data.append('file_name', acceptedFiles[0].name)
    
            fetch(`http://localhost:5000/contestImage/submission/${contestId}`, {
                method: 'POST',
                body: data,
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert("Successfully upload the image")
                history.goBack()
            })
            .catch((error) => {
                 console.error('Error:', error);
            })
        }
        // TODO: handle contestId is null (alert user then redirect to all contest page or other solutions)
    }

    return (
        <div className={classes.pageContainer}>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <Paper className={classes.paper}>
                    <Typography className={classes.pageTitle}>Submit Design</Typography>
                    <Button component='span' className={classes.uploadButton}>
                        <img src={process.env.PUBLIC_URL + '/images/upload-icon.png'} alt='Upload Icon' className={classes.image} />
                    </Button>
                    <div className={classes.instructionDiv}>
                        <Typography className={classes.boldText}>Click to choose a file</Typography>
                        <Typography>High resolution images</Typography>
                        <Typography>PNG, JPG, GIF</Typography>
                    </div>
                </Paper>
                <aside>
                    {acceptedFiles.length > 0 ? acceptedFileItems : (<div></div>)}
                    {fileRejectionItems.length > 0 ? fileRejectionItems : (<div></div>)}
                </aside>
            </div>
            <Box className={classes.buttonWrapper}>
                <Button className={classes.submitButton} onClick={handleUpload}>Submit</Button>
            </Box>
        </div>
    )
}