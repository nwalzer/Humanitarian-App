import React from 'react'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/auth';
import SelectInput from '@material-ui/core/Select/SelectInput';
import userContext from '../contexts/user';

import SearchBar from './SearchBar';


const ProtectedRoute = () => { 
    // Now all the data stored in the context can  
    // be accessed with the auth variable 
    const auth = React.useContext(userContext); 
    console.log(auth)
    console.log(auth.userState); 

    return auth.userState ? (
        <SearchBar />
    ) : (
        <Redirect to={{ pathname: '/' }} />
    );
  }; 
  export default ProtectedRoute; 

