import React from 'react'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/auth';

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

    render() {

        const Component = this.props.component;

        console.log("My State: ", this.state);
        console.log("My Status: ", this.state.userStatus);

        if (this.state != null) {

            if (this.state.userStatus == null) {
                return <div></div>;
            }

            if (this.state && this.state.userStatus) {
                return <Component />;
            }
            else if (!(this.state && this.state.userStatus)) {
                return <Redirect to={{ pathname: '/' }} />;
            }

        }
        else {
            return <div></div>;
        }


    }
}

export default ProtectedRoute;

