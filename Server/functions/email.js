const admin = require('firebase-admin');
const { user } = require('firebase-functions/lib/providers/auth');
require("firebase/auth");

//Sign in function should be called on the client side 
/* function signInWithEmailPassword(email, password) {
  admin.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("Successfully signed in user:", user);
      return;
    })
    .catch((error) => {
      console.log(error);
    });
} */

function sendEmailVerification() {
  admin.auth().currentUser.sendEmailVerification()
    .then(() => {
      return;
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
    });
}

function sendPasswordReset(email) {
  admin.auth().sendPasswordResetEmail(email)
    .then(() => {
      return;
    })
    .catch((error) => {
      console.log(error)
    });
}

module.exports = {sendPasswordReset, sendEmailVerification};