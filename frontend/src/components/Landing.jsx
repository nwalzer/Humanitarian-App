import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom'

export default function LandingPage() {
    let history = useHistory();

    const redirectMe = () => {
        console.log("Redirecting");
        history.push('/heatmap')
    }
    const redirectMe2 = () => {
        console.log("Redirecting");
        history.push('/heatmap')
    }

    return (
        <div>
            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom>
                    Welcome to the LGBT+ Resource Application Prototype!
       </Typography>
                <br />
                <Typography variant="subtitle1" gutterBottom>
                    If you’ve ever felt it was difficult to find LGBT+ safe zones and public resources in your town or city, or if you’re looking to compare
                    different towns and cities for their LGBT+ resource availability, this application is for you.
            </Typography>
                <Divider></Divider>
                <br />
                <Typography variant="subtitle1" gutterBottom>
                    This application is designed to <b> securely support the LGBT+ community and their allies</b> by attempting to standardize people’s access
                    to important resources, regardless of where they are in the United States.
            </Typography>
                <Divider></Divider>
                <br />
                <Typography variant="subtitle1" gutterBottom>
                    By creating a secure account and logging in, you will have access to a centralized list of resources for your current location,
                    as well as any location you choose in the United States. This list will also correspond to a map visualization so you can visualize
                    the density and spread of resources wherever you look. For the purposes of this prototype, only <b> select locations in Massachusetts </b>
                    are available in the database for your observation.
            </Typography>
                <Divider></Divider>
                <br></br>
                <Typography variant="subtitle1" gutterBottom>
                    Don’t want to create an account but would still like to see how a city/town is doing in terms of LGBT+ representation? Our application has an
                     <b> open feature </b> for the public that allows you to visualize the distribution of LGBT+ safe spaces and public resources for any of the locations
                    in the database! This visualization takes on the form of a <b>heatmap</b> so you can still see the density and spread of available resources, all without
                  betraying address information.
            </Typography>
                <br></br>
            </Container>
            <Button onClick={redirectMe} color="secondary" variant="contained">
                Go to Heatmap!
                </Button>
        </div>
    )
}