import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'
import { getProfile} from "../apiCalls"


const useStyles = makeStyles((theme) => ({ 
    profileSection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    avatar: {
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        marginTop: '4rem'
    }
}))

const EditProfilePage = () => {
    const defaultIcon = process.env.PUBLIC_URL + 'images/avatar-1.png';
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [iconURL, setIconURL] = useState(defaultIcon)

    useEffect(() => {
        getProfile((data) => {
            setUsername(data.username)
            setEmail(data.email)
            if (data.icon != null) {
                setIconURL(data.icon)
            }
        }, (error) => {
            console.log(error)
        })
    }, [])

    const onUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const onEmailChange = (event) => {
        setEmail(event.target.value)
    }
    
    return (
        <div>
            <form className={classes.profileSection}>

                <img src={iconURL} alt='avatar' className={classes.avatar}/>

                <div>
                    <TextField 
                        id="username" 
                        label="Username" 
                        value={username} 
                        onChange={onUsernameChange}
                        variant="outlined"
                        disabled={true}
                    />
                </div>

                <div>
                    <TextField 
                        id="email" 
                        label="Email" 
                        value={email} 
                        onChange={onEmailChange}
                        variant="outlined"
                        disabled={true}
                    />
                </div>
                
            </form>
        </div>
    );
}

export default EditProfilePage;