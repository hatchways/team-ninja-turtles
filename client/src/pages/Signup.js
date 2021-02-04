import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import RequestError, {getProfile, register} from "../apiCalls"
import { UserContext } from "../App";

const warningMsg = {
    emptyFieldError: "Required",
    passwordError: "Password must contain at least 6 characters",
    passwordNotMatch: "Confirme password must be matched",
    emailFormatError: "Please enter a correct email"
}

const useStyles = makeStyles(theme => ({
    root: {
        alignItems: "center",
    },
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    textField: {
        marginTop: theme.spacing(5),
        width: 300
    }, 
    button: {
        marginTop: theme.spacing(5)
    }
  }));

const Signup = () => {
    const classes = useStyles();
    const history = useHistory();
    const {user, setUser} = useContext(UserContext);
    const [username, setUsername] =  useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword ] = useState("");
    const [confirmPW, setConfirmPW] = useState("");
    const [usernameWarning, setUsernameWarning] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [emailWarning, setEmailWarning] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordWarning, setPasswordWarning] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPWWarning, setConfirmPWWarning] = useState("");
    const [confirmPWError, setConfirmPWError] = useState(false);

    // Used to detect if a field blurred without input
    const blurred = (event, field, setFieldError, setFieldWarning) => {
        if (field.length === 0) {
            setFieldError(true)
            setFieldWarning(warningMsg.emptyFieldError)
        }
    }

    const onUsernameChange = (event) => {
        const newValue = event.target.value
        const empty = newValue.length === 0
        setUsername(newValue)
        setUsernameError(empty)
        setUsernameWarning(empty ? warningMsg.emptyFieldError : "")
    }
    
    const onPasswordChange = (event) => {
        const newValue = event.target.value
        const lengthCheck = newValue.length < 6
        const empty = newValue.length === 0 
        setPassword(newValue)
        setPasswordError(lengthCheck || empty)
        setPasswordWarning(empty ? warningMsg.emptyFieldError : (lengthCheck ? warningMsg.passwordError : ""))
    }
    
    const onEmailChange = (event) => {
        const newValue = event.target.value
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const properEmail = !re.test(newValue) // regex matching
        const empty = newValue.length === 0
        
        setEmail(newValue)
        setEmailError(empty || properEmail)
        setEmailWarning(empty ? warningMsg.emptyFieldError : (properEmail ? warningMsg.emailFormatError : ""))
    }
    
    const onConfirmPWChange = (event) => {
        const newValue = event.target.value
        const lengthCheck = newValue.length < 6
        const empty = newValue.length === 0 
        const unmatch = newValue !== password
    
        setConfirmPW(newValue)
        setConfirmPWError(lengthCheck || empty || unmatch)
        setConfirmPWWarning(empty ? warningMsg.emptyFieldError : (lengthCheck ? warningMsg.passwordError : (unmatch ? warningMsg.passwordNotMatch: "")))
    }
    
    const submit = () => {
        if (!passwordError && !usernameError) {
            register(username, password, email, (data) => {
                // onSucess
                console.log("SUCCESS")
                // get profile and update context
                getProfile((data) => {
                    setUser({
                        username: data.username,
                        icon: process.env.PUBLIC_URL + 'images/avatar-1.png',
                        email: data.email
                    })
                    history.push("/")
                }, (error) => {
                    console.log(error)
                })
            }, (error) => {
                // onError
                if (error instanceof RequestError && error.status === 400) {
                    const errMsg = error.body
                    console.log(errMsg)
                    if (errMsg.password_error) {
                        setPasswordError(true)
                        setPasswordWarning(errMsg.password_error)
                    }

                    if (errMsg.user_error) {
                        setUsernameError(true)
                        setUsernameWarning(errMsg.user_error)
                    }

                    if (errMsg.email_error) {
                        setEmailError(true)
                        setEmailWarning(errMsg.email_error)
                    }
                } else {
                    console.log("unexpected error")
                }
            })   
        }
    }

    return (
        <form className={classes.root}>
            <div className={classes.container}>
                <h1>Sign Up</h1>
            </div>

            <div className={classes.container}>
                <TextField
                    id="email" label="Email" 
                    value={email}
                    error={emailError}
                    helperText={emailWarning}
                    variant="outlined"
                    onChange={onEmailChange}
                    onBlur={event => blurred(event, email, setEmailError, setEmailWarning)}
                    className={classes.textField}
                />
            </div>

            <div className={classes.container}>
                <TextField
                    id="username" label="Username" 
                    value={username}
                    error={usernameError}
                    helperText={usernameWarning}
                    variant="outlined"
                    onChange={onUsernameChange}
                    onBlur={event => blurred(event, username, setUsernameError, setUsernameWarning)}
                    className={classes.textField}
                />
            </div>
            
            <div className={classes.container}>
                <TextField 
                    id="password" 
                    label="Password"
                    value={password}
                    type={"password"}
                    error={passwordError}
                    helperText={passwordWarning}
                    variant="outlined"
                    onChange={onPasswordChange}
                    onBlur={event => blurred(event, password, setPasswordError, setPasswordWarning)}
                    className={classes.textField}
                /> 
            </div>

            <div className={classes.container}>
                <TextField 
                    id="confirmPW" 
                    label="Confirm Password"
                    value={confirmPW}
                    type={"password"}
                    error={confirmPWError}
                    helperText={confirmPWWarning}
                    variant="outlined"
                    onChange={onConfirmPWChange}
                    onBlur={event => blurred(event, confirmPW, setConfirmPWError, setConfirmPWWarning)}
                    className={classes.textField}
                /> 
            </div>

            <div className={classes.container}>
                <Button onClick={submit} variant="outlined" className={classes.button}>Sign Up</Button>
            </div>

            <div className={classes.container}>
                <Button onClick={() => history.push("/login")} className={classes.button}>Already Has an Account? Log-in</Button>
            </div>
        </form>
    );
}

export default Signup;
