import React, { useState, useEffect, useRef } from 'react'
import { Button, InputLabel, OutlinedInput} from '@material-ui/core'
import { getProfile, editProfile } from "../apiCalls"
import Dropzone, { useDropzone } from 'react-dropzone'
import './EditProfilePage.css'

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
);

const EditProfilePage = () => {
    const defaultIcon = process.env.PUBLIC_URL + 'images/avatar-1.png';
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [iconURL, setIconURL] = useState(defaultIcon)
    const [imageFile, setImageFile] = useState(null)
    const hiddenFileInput = useRef(null);

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
                <div className="float-container">
                    <div className="float-icon">
                        <img src={iconURL} alt='avatar' className='avatar'/>
                        
                        <input type="file" ref={hiddenFileInput} style={{display:'none'}} onChange={handleFileChange} accept="image/*"/> 
                        <Button className="upload" variant="outlined" onClick={uploadFile} >Upload</Button>
                        
                    </div>
                    
                    <div className="float-div">
                        <div className="icon-text-top"><b>Personal Information</b></div>

                        <ColoredLine color="LightGrey" marginTop={20} marginBottom={30} marginLeft={0}/>

                        <div className="textfield-box">
                            <InputLabel htmlFor="username"> Username </InputLabel>
                            <OutlinedInput className="textfield-input" id="username" value={username} onChange={onUsernameChange} disabled={true} variant="outlined"/>
                        </div>

                        <div>
                            <InputLabel htmlFor="email"> Email </InputLabel>
                            <OutlinedInput className="textfield-input" id="email" value={email} onChange={onEmailChange} disabled={true} variant="outlined"/>
                        </div>

                        <div className="icon-text"><b>Password</b></div>

                        <ColoredLine color="LightGrey" marginTop={20} marginBottom={30} marginLeft={0}/>

                        <div className="textfield-box"> 
                            <InputLabel htmlFor="email"> New Password </InputLabel>
                            <OutlinedInput className="textfield-input" id="email" disabled={true} variant="outlined"/>
                        </div>

                        <div className="textfield-box">
                            <InputLabel htmlFor="email"> Confirm Password </InputLabel>
                            <OutlinedInput className="textfield-input" id="email" disabled={true} variant="outlined"/>
                        </div>

                        <Button className="submit" variant="outlined" onClick={submit}>Save</Button>
                        
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditProfilePage;