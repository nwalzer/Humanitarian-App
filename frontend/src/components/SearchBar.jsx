import React from 'react';
import { createMuiTheme, withStyles, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useHistory  } from 'react-router-dom'



const CssTextField = withStyles({
    root: {
        '& .MuiOutlinedInput-input':{
            padding: '18px 60px',
        },
        '& label.Mui-focused': {
            color: 'white',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white',
            },
        },
    },
})(TextField);

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));




export default function BasicButtonGroup() {
    const classes = useStyles();
    let history = useHistory();

    const redirectMe = () => {
        console.log("Redirecting"); 
        history.push('/heatmap')
    }

    return (
        <div className={classes.root}>
            <ButtonGroup variant="outlined" color="primary" aria-label="text primary button group">
                <CssTextField 
                    id="city-town"
                    label="City/Town Name"
                    variant="outlined"
                    color="secondary"
                />
                <CssTextField
                    id="zip-code"
                    label="Zip Code"
                    variant="outlined"
                    color="secondary"
                />
                <Button onClick = {redirectMe} color="secondary" variant="contained">
                    Go!
                </Button>
            </ButtonGroup>
        </div>

    );
}