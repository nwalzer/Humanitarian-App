import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom'

export default function AboutUs() {
    // let history = useHistory();

    // const redirectMe = () => {
    //     console.log("Redirecting");
    //     history.push('/heatmap')
    // }
    // const redirectMe2 = () => {
    //     console.log("Redirecting");
    //     history.push('/heatmap')
    // }

    return (
        <div>
            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom>
                    About Us 
                </Typography>
                <br />
                <Typography variant="subtitle1" gutterBottom>
                    LOLOLOLO
                 </Typography>
                <Divider></Divider> 
            </Container>
        </div>
    )
}