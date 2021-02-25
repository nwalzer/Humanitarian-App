import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyANsDTPAi16_Bo2nBQM4FX1WWlLwVIGboI",
  authDomain: "humanitarian-app-development.firebaseapp.com",
  databaseURL: "https://humanitarian-app-development.firebaseio.com",
  projectId: "humanitarian-app-development",
  storageBucket: "humanitarian-app-development.appspot.com",
  messagingSenderId: "82772110458",
  appId: "1:82772110458:web:708a4080607257bd419fc3",
  measurementId: "G-63LLNC22GW"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
