import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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

const WhiteTextTypography = withStyles({
    root: {
      color: "#FFFFFF"
    }
  })(Typography);

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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phonenum, setPhoneNumber] = useState("");
    const [passwordMatch, setPasswordMatch] = useState("");
    const [disableRegister, setRegister] = useState(true);
    const [error, setError] = useState("");

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleUsername = (event) => {
        setUsername(event.target.value);
        evalRegister(event.target.value, password, passwordMatch, phonenum);
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
        evalRegister(username, event.target.value, passwordMatch, phonenum);
    }

    const handlePNum = (num) => {
        setPhoneNumber(num);
        evalRegister(username, password, passwordMatch, num);
    }

    const handlePasswordMatch = (event) => {
        setPasswordMatch(event.target.value);
        evalRegister(username, password, event.target.value, phonenum);
    }

    //Client-side input validation
    const evalRegister = (uname, pword, pmatch, phone) => {
        if(uname.length < 4 || uname.length > 16 || uname.replace(/[A-Za-z0-9]/g, "").length > 0){
            setError("Please ensure your username is 4-16 alphanumeric characters long");
            setRegister(true);
        } else if (pword.length < 8 || pword.length > 32){
            setError("Please ensure your password is 8-32 characters long");
            setRegister(true);
        } else if (!pword.match(/[A-Z]/) || !pword.match(/[a-z]/) 
            || !pword.match(/[0-9]/) || pword.replace(/[A-Za-z0-9]/g, "").length == 0 
            || pword.replace(/\s+/, "").length != pword.length){
                setError("Please ensure your password contains 1 uppercase, 1 lowercase, 1 number, 1 special character, and no spaces");
                setRegister(true);
        } else if (pword != pmatch){
            setError("Please ensure your passwords match");
            setRegister(true);
        } else if (phone.length != 12 || phone.charAt(0) != "+" || phone.charAt(1) != "1"){
            setError("Please ensure your phone number is in in the form XXX-XXX-XXXX");
            setRegister(true);
        } else {
            setError("");
            setRegister(false);
        }
    }

    const handleRegister = () => {
        var data = { username: username, pass: password, phone: phonenum};
        //firebase.functions().useEmulator("localhost", 5001);
        var register = firebase.functions().httpsCallable('register');
        register(data).then(res => {
            if(res.data.status === "FAILED" || res.data.status == "ERROR"){
                switch (res.data.error){
                    case "MALFORMED UNAME":
                        setError("Please ensure your username is 4-16 alphanumeric characters long");
                        break;
                    case "MALFORMED PASS":
                        setError("Please ensure your password is 8-32 characters long and contains 1 uppercase, 1 lowercase, 1 number, 1 special character, and no spaces");
                        break;
                    case "MALFORMED PHONE":
                        setError("Please ensure your phone number is in in the form XXX-XXX-XXXX");
                        break;
                    case "USER EXISTS":
                        setError("Sorry, that username is already taken");
                        break;
                    default:
                        setError("An unknown error occurred. Please try again in a few minutes.");
                        console.log(res.data.error);
                }
            } else {
                setError("Registration successful");
            }
        });
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
                    <p>Username must be 4-16 characters, containing only letters and numbers </p>
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
                    <p>Password must be 8-32 characters, with at least 1 uppercase, 1 lowercase, 1 number, and 1 (non-whistespace) special character. </p>
                </ListItem> 
                <ListItem>
                    <TextField
                        onChange={handlePasswordMatch}
                        id="standard-password-match-input"
                        label="Retype your password"
                        type="password"
                        autoComplete="current-passwordMatch"
                    />
                </ListItem>
                <ListItem>
                    <PhoneInput
                        country="US"
                        placeholder="Phone Number"
                        onChange={handlePNum} />
                </ListItem>
                <ListItem>
                    <p>Phone num </p>
                </ListItem> 
            </List>
            <p style={{ color: 'red' }}>{error}</p>
            <Button disabled={disableRegister} onClick={handleRegister}> Register Account </Button>
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
                <WhiteTextTypography noWrap> Register Account </WhiteTextTypography>
                    </Button>
                <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />


            </div>
        );
    }
}