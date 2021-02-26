import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
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
    const [username, setUsername] = useState(" ");
    const [password, setPassword] = useState(" ");
    const handleUsername = (event) => {
        setUsername(event.target.value);
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
    }
    const handleClose = () => {
        onClose(selectedValue);
    };


    //   const handleListItemClick = (value) => {
    //     onClose(value);
    //   };

    const handleLogin = () => {
        var data = {username: username, pass: password};
        //firebase.functions().useEmulator("localhost", 5001);
        var login = firebase.functions().httpsCallable('login');
        login(data).then(res=>{
            console.log(res);
            if(res.data.status == "FAILED" || res.data.status == "ERROR"){
                //do something
            } else {
                console.log(res.data.TOK);
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
                firebase.auth().signInWithCustomToken(res.data.TOK).then(userCred => {
                    console.log(userCred);
                    //transition to new screen
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
            <Button onClick={handleLogin}> Login </Button>
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
    const [selectedValue, setSelectedValue] = React.useState();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Login
      </Button>
            <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
        </div>
    );
}