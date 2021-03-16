import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/auth';

import { useHistory } from 'react-router-dom'

const WhiteTextTypography = withStyles({
    root: {
        color: "#FFFFFF"
    }
})(Typography);

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: blue[50],
        color: blue[50],
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [disableLogin, setDisableLogin] = useState(true);
    const [error, setError] = useState("");

    const handleUsername = (event) => {
        setUsername(event.target.value);
        evalLogin(event.target.value, password);
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
        evalLogin(username, event.target.value);
    }
    const handleClose = () => {
        onClose(selectedValue);
    };

    const evalLogin = (uname, pword) => {
        if (uname.length < 4 || uname.length > 16 || uname.replace(/[A-Za-z0-9]/g, "").length > 0) {
            setDisableLogin(true);
        } else if (pword.length === 0) {
            setDisableLogin(true);
        } else {
            setDisableLogin(false);
        }
    }

    let history = useHistory();


    const handleLogin = () => {
        var data = { username: username, pass: password };
        //firebase.functions().useEmulator("localhost", 5001);
        var login = firebase.functions().httpsCallable('login');
        return login(data).then(res => {
            if (res.data.status == "FAILED" || res.data.status == "ERROR") {
                setError("This username and password combination is not valid, please try again");
                return false;
            } else {
                setError("");
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
                return firebase.auth().signInWithCustomToken(res.data.TOK).then(userCred => {
                    console.log("Redirecting");
                    history.push('/userhome')
                    return true;
                    //transition to new screen
                }).catch(error => {
                    console.log(error);
                    return false;
                })
            }
        });
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Sign into your account:</DialogTitle>
            <List>
                <ListItem>
                    <TextField
                        onChange={handleUsername}
                        id="standard-username-input"
                        label="Username"
                        type="username"
                        autoComplete="current-username"
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        onChange={handlePassword}
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                    />
                </ListItem>
            </List>
            <p style={{ color: 'red' }}>{error}</p>
            <Button disabled={disableLogin} onClick={handleLogin}> Login </Button>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function Login() {
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState();
    let history = useHistory();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    firebase.auth().onAuthStateChanged(userStatus => {
        if (userStatus) {
            setUser(true);
        } else {
            setUser(false);
        }
    });
    const handleClickHome = () => {
        setOpen(false);
        history.push('/');

    };
    const handleClickHeat = () => {
        setOpen(false);
        history.push('/heatmap');
    };

    if (user) {
        return <div></div>;
    }
    else {
        return (
            <div>
                <Button color="primary" onClick={handleClickHome}>
                    <WhiteTextTypography noWrap> Home </WhiteTextTypography>
                </Button>
                <br />
                <Button color="primary" onClick={handleClickHeat}>
                    <WhiteTextTypography noWrap> Resource Heatmap </WhiteTextTypography>
                </Button>
                <br />
                <Button color="default" onClick={handleClickOpen}>
                    <WhiteTextTypography noWrap> Login </WhiteTextTypography>
                </Button>

                <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />


            </div>
        );
    }

}