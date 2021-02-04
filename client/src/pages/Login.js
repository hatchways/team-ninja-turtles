import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"
import React, { useContext, useState } from "react";
import RequestError, { login, getProfile } from "../apiCalls";
import { UserContext } from "../App"
import { useHistory } from "react-router-dom"

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

const Login = () => {
    const classes = useStyles();
    const {user, setUser} = useContext(UserContext);
    const history = useHistory();
    const [username, setUsername] =  useState("");
    const [password, setPassword ] = useState("");
    const [usernameWarning, setUsernameWarning] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordWarning, setPasswordWarning] = useState("");
    const [passwordError, setPasswordError] = useState(false);

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
    
    const submit = () => {
        if (!passwordError && !usernameError) {
            login(username, password, (data) => {
                // get profile and update context
                getProfile((data) => {
                    console.log(data.icon)
                    setUser({
                        username: data.username,
                        icon: (data.icon == null) ? process.env.PUBLIC_URL + 'images/avatar-1.png' : data.icon,
                        email: data.email
                    })
                    history.push("/")
                }, (error) => {
                    console.log("Unexpected Error")
                })
            },  (error) => {
                // onError
                console.log(error)
                if (error instanceof RequestError && error.status === 400) {
                    const errMsg = error.body
                    if (errMsg.password_error) {
                        setPasswordError(true)
                        setPasswordWarning(errMsg.password_error)
                    }

                    if (errMsg.user_error) {
                        setUsernameError(true)
                        setUsernameWarning(errMsg.user_error)
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
                <h1>Log In</h1>
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
                <Button onClick={submit} variant="outlined" className={classes.button}>Login</Button>
            </div>

            <div className={classes.container}>
                <Button onClick={() => history.push("/signin")} className={classes.button}>Not Registered? Sign-up</Button>
            </div>
        </form>
    );
}

export default Login;
