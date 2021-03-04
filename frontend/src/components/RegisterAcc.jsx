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
import Input from '@material-ui/core/Input'
import PhoneInput from 'react-phone-number-input/input'

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
    const [phonenum, setPhoneNumber] = useState(" ");
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

    const handleRegister = () => {
        var data = { username: username, pass: password, phone: phonenum};
        //firebase.functions().useEmulator("localhost", 5001);
        var register = firebase.functions().httpsCallable('register');
        register(data).then(res => console.log(res));
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Create a new account:</DialogTitle>
            <List>
                <ListItem>
                    <TextField
                        onChange={handleUsername}
                        id="standard-username-input"
                        label="Create Username"
                        type="username"
                        autoComplete="current-username"
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        onChange={handlePassword}
                        id="standard-password-input"
                        label="Create Password"
                        type="password"
                        autoComplete="current-password"
                    />
                </ListItem>
                <ListItem>
                    <p>Password needs to be 8-32 characters, with at least 1 uppercase, 1 lowercase, 1 number and 1 special character. </p>
                    </ListItem> 
                <ListItem>
                    <PhoneInput
                        country="US"
                        placeholder="Phone Number"
                        value={phonenum}
                        onChange={setPhoneNumber} />
                </ListItem>
            </List>
            <Button onClick={handleRegister}> Register Account </Button>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function Register() {
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    firebase.auth().onAuthStateChanged(userStatus => {
        console.log("Found", userStatus);
        if (userStatus) {
            setUser(true);
        } else {
            setUser(false);
        }
    });

    if (user) {
        return <div></div>;
    }
    else {
        return (
            <div>
                <Button color="primary" onClick={handleClickOpen}>
                    Register Account
                    </Button>
                <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />


            </div>
        );
    }
}