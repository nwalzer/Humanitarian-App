import React from 'react'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/auth';
import SearchBar from './SearchBar';

class ProtectedRoute extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userStatus: null
        }
    } 

    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            console.log("Found", user);
            let res = false;
            if(user){
                res = true;
            } else {
                res = false;
            }
            this.setState({userStatus: res}, () => {
                console.log(this.state);
            });
        }) 
    }

    render(){
        console.log(this.state);
        return this.state && this.state.userStatus ? (
            <SearchBar />
        ) : (
                <div/>
            );
    }
}

export default ProtectedRoute;

