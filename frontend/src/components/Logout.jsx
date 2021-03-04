import React from 'react'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/auth';
import Button from '@material-ui/core/Button';

class ProtectedRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userStatus: null
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            console.log("Found", user);
            let res = false;
            if (user) {
                res = true;
            } else {
                res = false;
            }
            this.setState({ userStatus: res }, () => {
                console.log(this.state);
            });
        })
    }
    
    handleLogout() {
        firebase.auth().signOut();
    }
    handleClick(e) {
        this.handleLogout(); 
    }

    render() {

        console.log("My State: ", this.state);
        if (this.state != null) {

            if (this.state.userStatus == null) {
                return <div></div>;
            }

            if (this.state && this.state.userStatus) {
                return <Button color="primary" onClick = {this.handleClick.bind(this)}>Logout</Button>;
            }
            else if (!(this.state && this.state.userStatus)) {
                return <div></div>;
            }

        }
        else {
            return <div></div>;
        }


    }
}

export default ProtectedRoute;



