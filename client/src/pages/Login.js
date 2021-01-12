import { Button, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles"
import React from "react";

const warningMsg = {
    emptyFieldError: "Required",
    passwordError: "Password must contain at least 6 characters"
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

class Login extends React.Component {
    state = {
        username : "",
        password : "",
        usernameWarning: "",
        usernameError: false,
        passwordWarning: "",
        passwordError: false
    };

    onUsernameChange = (event) => {
        var empty = event.target.value.length == 0
        this.setState({
            username: event.target.value,
            usernameError: empty, 
            usernameWarning: empty ? warningMsg.emptyFieldError: ""
        })
    }

    onPasswordChange = (event) => {
        var lengthCheck = event.target.value.length < 6
        var empty = event.target.value.length == 0 

        this.setState({
            password: event.target.value,
            passwordError: lengthCheck || empty, 
            passwordWarning: empty ? warningMsg.emptyFieldError : (lengthCheck ? warningMsg.passwordError : "")
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
                    <h1>Sign In</h1>
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
                    <Button onClick={this.submit} variant="outlined" className={classes.button}>Login</Button>
                </div>
            </form>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Login);
