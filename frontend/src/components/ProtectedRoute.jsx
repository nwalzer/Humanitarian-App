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
        console.log(props);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            let res = false;
            if (user) {
                res = true;
            } else {
                res = false;
            }
            this.setState({ userStatus: res }, () => {
                //this output forces a state update
                console.log(this.state);
            });
        })
    }

    render() {
        const Component = this.props.component;
        if (this.state != null) {
            if (this.state.userStatus == null) {
                return <div></div>;
            } else if (this.state.userStatus) {
                let pathID = "";
                try {
                    pathID = this.props.computedMatch.params.id;
                } catch (e){
                    pathID = "";
                }
                return <Component pathID={pathID}/>;
            }
            else {
                return <Redirect to={{ pathname: '/' }} />;
            }
        }
        else {
            return <div></div>;
        }
    }
}

export default ProtectedRoute;

