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
                    About The Project 
                </Typography>
                <br />
                <Typography variant="subtitle1" gutterBottom>
                We are an undergraduate capstone project team from Worcester Polytechnic Institute, MA, looking to help address the problem 
                of <b>resource access inequity</b> for the United States LGBT+ population. This project combines social science and Human Computer 
                Interaction (HCI) research as well as prior survey outreach insights from LGBT+ identifying university members to develop 
                this prototype. Our project goal is to help democratize access to LGBT+ resources and information in the United States, as well 
                as raise awareness on issues surrounding access inequity that affect countless LGBT+ identifying individuals across the country.
                 </Typography>
                <Divider></Divider> 
                <br />
                <Typography variant="subtitle1" gutterBottom>
                The prototype has three main features: (1) An <b>open feature</b> that showcases a high-level heatmap visualization of LGBT+ safe 
                spaces and resources available in the United States, (2) A <b>closed feature</b> that is accessible only by creating a secure 
                account with the application; this feature showcases an interactive map visualization upon which the resource locations 
                are displayed (using markers), as well as a list of these resources and their business information, and (3) <b>User 
                functionality</b>, where users can create accounts, leave reviews for the resources and further validate their efficacy 
                for the app community. 
                 </Typography>
                <Divider></Divider>
                <br />
                <Typography variant="subtitle1" gutterBottom>
                To register an account, we recommend downloading Google Authenticator or another 2-Factor Authentication (2FA) app service in order 
                to register an account with us. This is to ensure individual users are better protected when using this application.
                 </Typography>
                <Divider></Divider> 
                <br />
                <Typography variant="subtitle1" gutterBottom>
                As this is only a prototype, you will not see moderation support, support for filtering and tagging and a few other 
                production-level features. However, you will be able to fully interact with the application’s main proposed features. 
                 </Typography>
                <Divider></Divider> 
            </Container>
        </div>
    )
}