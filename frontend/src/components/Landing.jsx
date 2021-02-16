import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

export default function LandingPage() {
    return (
        <div>
            <Container maxWidth="md">
                <Typography variant="h3" gutterBottom>
                    Welcome to the application.
       </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    This application consolidates LGBT+ location resources for every navigable city/town onto a secure platform just for you.
            </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Create an account and log in to see a centralized list of resources for <b>your current location</b>, along with where they are on a localized map.
            </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Don't want to create an account but would like to see how a city/town is doing in terms of LGBT+ representation? Our application has
            an <b>open feature</b> for the public that allows you to visualize the distribution of LGBT+ location resources in any given city/town in our database!
            Just search here:
            </Typography>
                <br />
            </Container>
        </div>
    )
}