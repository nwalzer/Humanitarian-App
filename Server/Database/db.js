  // Set the configuration for your app
  // TODO: Replace with your project's config object
  import firebase from "firebase/app";
import "firebase/database";

function getReference() {
  var database = firebase.database();
}

  var config = {
    apiKey: "",
    authDomain: "humanitarian-app-development.firebaseapp.com",
    databaseURL: "https://humanitarian-app-development.firebaseio.com",
    storageBucket: "bucket.appspot.com"
  };
  firebase.initializeApp(config);