import { Button, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles"
import React from "react";

const warningMsg = {
    emptyFieldError: "Required",
    passwordError: "Password must contain at least 6 characters",
    passwordNotMatch: "Confirme password must be matched",
    emailFormatError: "Please enter a correct email"
}

const styles = theme => ({
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
  });

class Signup extends React.Component {
    state = {
        username : "",
        email: "",
        password : "",
        confirmPW: "",
        usernameWarning: "",
        usernameError: false,
        emailWarning: "",
        emailError: false,
        passwordWarning: "",
        passwordError: false,
        confirmPWWarning: "",
        confirmPWError: ""
    };

    onUsernameChange = (event) => {
        const empty = event.target.value.length == 0
        this.setState({
            username: event.target.value,
            usernameError: empty, 
            usernameWarning: empty ? warningMsg.emptyFieldError : ""
        })
    }

    onPasswordChange = (event) => {
        const lengthCheck = event.target.value.length < 6
        const empty = event.target.value.length == 0 

        this.setState({
            password: event.target.value,
            passwordError: lengthCheck || empty, 
            passwordWarning: empty ? warningMsg.emptyFieldError : (lengthCheck ? warningMsg.passwordError : "")
        })
    }

    onEmailChange = (event) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const properEmail = !re.test(event.target.value) // regex matching
        const empty = event.target.value.length == 0 
        this.setState({
            email: event.target.value,
            emailError: empty || properEmail,
            emailWarning: empty ? warningMsg.emptyFieldError : (properEmail ? warningMsg.emailFormatError : "")
        })
    }

    onConfirmPWChange = (event) => {
        const lengthCheck = event.target.value.length < 6
        const empty = event.target.value.length == 0 
        const unmatch = event.target.value != this.state.password

        this.setState({
            confirmPW: event.target.value,
            confirmPWError: lengthCheck || empty || unmatch, 
            confirmPWWarning: empty ? warningMsg.emptyFieldError : 
                (lengthCheck ? warningMsg.passwordError : (unmatch ? warningMsg.passwordNotMatch: ""))
        })
    }

    submit = () => {
        if (!this.state.passwordError && !this.state.usernameError) {
            // TODO : submit to the sever   
        }
    
        console.log(this.state.username)
        console.log(this.state.password)
    }
    
    render() {
        const { classes } = this.props;

        return (
            <form className={classes.root}>
                <div className={classes.container}>
                    <h1>Sign Up</h1>
                </div>

                <div className={classes.container}>
                    <TextField
                        id="email" label="Email" 
                        value={this.state.email}
                        error={this.state.emailError}
                        helperText={this.state.emailWarning}
                        variant="outlined"
                        onChange={this.onEmailChange}
                        className={classes.textField}
                    />
                </div>

                <div className={classes.container}>
                    <TextField
                        id="username" label="Username" 
                        value={this.state.username}
                        error={this.state.usernameError}
                        helperText={this.state.usernameWarning}
                        variant="outlined"
                        onChange={this.onUsernameChange}
                        className={classes.textField}
                    />
                </div>
                
                <div className={classes.container}>
                    <TextField 
                        id="password" 
                        label="Password"
                        value={this.state.password}
                        type={"password"}
                        error={this.state.passwordError}
                        helperText={this.state.passwordWarning}
                        variant="outlined"
                        onChange={this.onPasswordChange}
                        className={classes.textField}
                    /> 
                </div>

                <div className={classes.container}>
                    <TextField 
                        id="confirmPW" 
                        label="Confirm Password"
                        value={this.state.confirmPW}
                        type={"password"}
                        error={this.state.confirmPWError}
                        helperText={this.state.confirmPWWarning}
                        variant="outlined"
                        onChange={this.onConfirmPWChange}
                        className={classes.textField}
                    /> 
                </div>

                <div className={classes.container}>
                    <Button onClick={this.submit} variant="outlined" className={classes.button}>Login</Button>
                </div>
            </form>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Signup);
