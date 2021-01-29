import React, { useState, useEffect, useRef, useContext } from 'react'
import { Button, InputLabel, OutlinedInput} from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles"
import { getProfile, editProfile } from "../apiCalls"
import { UserContext } from '../App'


const useStyles = makeStyles(theme => ({
    titleText: {
        margin: "40px",
        fontSize: "30px",
    },
    iconTextTop: {
        marginBottom: "10px",
        fontSize: "20px",
    },
    
    iconText: {
        marginTop: "50px",
        marginBottom: "10px",
        fontSize: "20px",
    },
    
    floatContainer: {
        padding: "20px",
        display: "flex",
    },
    
    floatIcon: {
        width: "200px",
        float: "left",
        padding: "20px",
        paddingRight: "60px",
        justifyContent: "center",
    },
    
    upload: {
        position: "relative",
        top: "5%",
        left: "25%",
    },
    
    submit: {
        position: "relative",
        top: "5%",
    },
    
    floatDiv: {
        width: "70%",
        float: "left",
        padding: "20px",
    },
    
    avatar: {
        width: "200px",
        height: "200px",
        borderRadius: "50%"
    },
    
    textfieldBox: {
        marginBottom: "40px",
    },
    
    textfieldInput: {
        width: "50%"
    }
}))

const ColoredLine = ({ color, marginTop, marginBottom, marginLeft }) => (
    <hr
        style={{
            backgroundColor: color,
            height: .1,
            marginTop: marginTop,
            marginBottom: marginBottom,
            marginLeft: marginLeft,
            marginRight: "30%"
        }}
    />
)

const EditProfilePage = () => {
    const classes = useStyles();
    const {user, setUser} = useContext(UserContext)
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [iconURL, setIconURL] = useState(user.icon)
    const [imageFile, setImageFile] = useState(null)
    const hiddenFileInput = useRef(null);

    useEffect(() => {
        setUsername(user.username)
        setEmail(user.email)
        setIconURL(user.icon)
    }, [user])

    const uploadFile = (event) => {
        hiddenFileInput.current.click()
    }

    const handleFileChange = event => {
        const fileUploaded = event.target.files[0];
        console.log(fileUploaded)
        setIconURL(URL.createObjectURL(fileUploaded))
        setImageFile(fileUploaded)
    }

    const submit = () => {
        const data = new FormData()

        data.append("file_name", (imageFile == null ? "": imageFile.name))
        if (imageFile != null) {
            data.append("icon", imageFile);
        }
        editProfile(data, (data) => {
            console.log("success")
            // get profile and update context
            getProfile((data) => {
                setUser({
                    username: data.username,
                    icon: (data.icon == null) ? process.env.PUBLIC_URL + 'images/avatar-1.png' : data.icon,
                    email: data.email
                })
                console.log(data)
            }, (error) => {
                console.log(error)
            })
        }, (error) => {
            console.log(error)
        })
    }

    const onUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const onEmailChange = (event) => {
        setEmail(event.target.value)
    }

    return (
        <div>        
            <form className="profile-section">
                <div className={classes.floatContainer}>
                    <div className={classes.floatIcon}>
                        <img src={iconURL} alt='avatar' className={classes.avatar}/>
                        
                        <input type="file" ref={hiddenFileInput} style={{display:'none'}} onChange={handleFileChange} accept="image/*"/> 
                        <Button className={classes.upload} variant="outlined" onClick={uploadFile} >Upload</Button>
                        
                    </div>
                    
                    <div className={classes.floatDiv}>
                        <div className={classes.iconTextTop}><b>Personal Information</b></div>

                        <ColoredLine color="LightGrey" marginTop={20} marginBottom={30} marginLeft={0}/>

                        <div className={classes.textfieldBox}>
                            <InputLabel htmlFor="username"> Username </InputLabel>
                            <OutlinedInput className={classes.textfieldInput} id="username" value={username} onChange={onUsernameChange} disabled={true} variant="outlined"/>
                        </div>

                        <div>
                            <InputLabel htmlFor="email"> Email </InputLabel>
                            <OutlinedInput className={classes.textfieldInput} id="email" value={email} onChange={onEmailChange} disabled={true} variant="outlined"/>
                        </div>

                        <div className={classes.iconText}><b>Password</b></div>

                        <ColoredLine color="LightGrey" marginTop={20} marginBottom={30} marginLeft={0}/>

                        <div className={classes.textfieldBox}> 
                            <InputLabel htmlFor="email"> New Password </InputLabel>
                            <OutlinedInput className={classes.textfieldInput} id="email" disabled={true} variant="outlined"/>
                        </div>

                        <div className={classes.textfieldBox}>
                            <InputLabel htmlFor="email"> Confirm Password </InputLabel>
                            <OutlinedInput className={classes.textfieldInput} id="email" disabled={true} variant="outlined"/>
                        </div>

                        <Button className={classes.submit} variant="outlined" onClick={submit}>Save</Button>
                        
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditProfilePage;