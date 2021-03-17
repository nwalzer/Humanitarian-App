import React from 'react';
import { Rating, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Button, TextField } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/auth';



export default function Review(props) {
    const [characters, setCharacters] = React.useState(300);
    const [rating, setRating] = React.useState(1);
    const [content, setContent] = React.useState("");
    const [anon, setAnon] = React.useState("No");
    const [errorText, setErrorText] = React.useState("");
    let history = useHistory();

    const updateCC = (event) => {
        let numChars = event.target.value.length;
        setCharacters(300-numChars);
        setContent(event.target.value);
    }

    const handleAnon = (event, newAnon) => {
        setAnon(newAnon);
      };

    const handleSubmit = () => {
        var data = { content: content, rating: rating, anon: anon === "Yes"? true : false, locID: props.pathID };
        //firebase.functions().useEmulator("localhost", 5001);
        var review = firebase.functions().httpsCallable('review');
        return review(data).then((val) => {
            if(val.data.status === "SUCCESS"){
                history.push('/userhome');
            } else {
                setErrorText(val.data.error);
            }
        })
    }

    return (
        <div>
            <p>Write a Review</p>
            <TextField
                placeholder="Please describe your experience using this resource"
                multiline
                rows={4}
                rowsMax={4}
                onChange={updateCC}
                />
            <p style={{ color: characters < 0 ? "red" : "white" }}>Remaining characters: {characters} / 300</p>
            <p>Please rate your experience</p>
            <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                    setRating(newValue);
                }}
                />
            <p>Write review anonymously?*</p>
            <ToggleButtonGroup
                value={anon}
                exclusive
                onChange={handleAnon}
                aria-label="Use Anonymous?"
                >
                <ToggleButton value="Yes" aria-label="Yes">
                    Yes
                </ToggleButton>
                <ToggleButton value="No" aria-label="No">
                    No
                </ToggleButton>
            </ToggleButtonGroup>
            <p style={{color: "red"}}>{errorText}</p>
            <Button disabled={characters < 0 ? true : false} onClick={handleSubmit}>Submit Review</Button>
            <p>* Choosing to write a review anonymously will display "Anonymous" as the author when the review is displayed. We still keep track of which users write which reviews regardless of anonymous status</p>
        </div>
    )
}