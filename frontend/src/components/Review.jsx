import React from 'react';
import { Rating, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Button, TextField } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/auth';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import '../assets/review.css'

const WhiteTextTypography = withStyles({
    root: {
        color: "#FFFFFF"
    }
})(Typography);



export default function Review(props) {
    const [characters, setCharacters] = React.useState(300);
    const [rating, setRating] = React.useState(1);
    const [content, setContent] = React.useState("");
    const [anon, setAnon] = React.useState("No");
    const [errorText, setErrorText] = React.useState("");
    let history = useHistory();

    const updateCC = (event) => {
        let numChars = event.target.value.length;
        setCharacters(300 - numChars);
        setContent(event.target.value);
    }

    const handleAnon = (event, newAnon) => {
        setAnon(newAnon);
    };

    const handleSubmit = () => {
        var data = { content: content, rating: rating, anon: anon === "Yes" ? true : false, locID: props.pathID };
        //firebase.functions().useEmulator("localhost", 5001);
        var review = firebase.functions().httpsCallable('review');
        return review(data).then((val) => {
            if (val.data.status === "SUCCESS") {
                history.push('/userhome');
            } else {
                setErrorText(val.data.error);
            }
        })
    }

    return (
        <div class = 'internal-review-container'>
            <WhiteTextTypography variant="h3" align="center" >Write a Review</WhiteTextTypography>
            <br></br>
            <WhiteTextTypography variant="h5" align="center" >Please describe your experience using this resource: </WhiteTextTypography>
            <WhiteTextTypography variant="caption" align="center" >Remaining characters: {characters} / 300 </WhiteTextTypography>
            <TextField
                placeholder="Enter here"
                multiline
                rows={4}
                rowsMax={4}
                onChange={updateCC}
                fullWidth
            />
            
            <br></br>
            <br></br>
            <WhiteTextTypography variant="h5" align="center" >Please rate your overall experience. </WhiteTextTypography>
            <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                    setRating(newValue);
                }}
            />
            <br></br>
            <br></br>
            <WhiteTextTypography variant="h5" align="center" >Is your review anonymous? </WhiteTextTypography>
            <WhiteTextTypography variant="caption" align="center" >Choosing to write a review anonymously will display "Anonymous" as the author when the review is displayed. Our website will still internally keep track of which users write which reviews regardless of anonymous status. </WhiteTextTypography>
            <br></br>
            <ToggleButtonGroup
                value={anon}
                exclusive
                onChange={handleAnon}
                aria-label="Use Anonymous?"
            >
                <ToggleButton value="Yes" aria-label="Yes" color = 'black'>
                    Yes
                </ToggleButton>
                <ToggleButton value="No" aria-label="No">
                    No
                </ToggleButton>
            </ToggleButtonGroup>
            <p style={{ color: "red" }}>{errorText}</p>
            <Button variant = 'secondary' disabled={characters < 0 ? true : false} onClick={handleSubmit}><WhiteTextTypography variant="h5" align="center" >Submit Review</WhiteTextTypography></Button>
        </div>
    )
}