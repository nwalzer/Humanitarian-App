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

function createCustomToken(uname, db){
  const ref = db.collection('users')

  return ref.where('uname', '==', uname).get().then(snapshot => {
    if (snapshot.empty) {
      return "FAILED";
    }  else {
      let uid = "";
      snapshot.forEach(doc => {
        uid = doc.id;
      });
      
      return admin
            .auth()
            .createCustomToken(uid)
            .then((customToken) => {
              return customToken
            })
            .catch((error) => {
              console.log('Error creating custom token:', error);
            });
    }
  }).catch((error) => {
    console.log('Error getting UID:', error);
  });

}

function registerUser(username, pass, phone, email) {
  admin
  .auth()
  .createUser({
    email: email,
    phoneNumber: phone,
    password: pass,
    displayName: username
  })
  .then((userRecord) => {
    console.log('Successfully created new user:', userRecord.uid);
    return;
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
  });
}

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

module.exports = {sendPasswordReset, sendEmailVerification, registerUser, createCustomToken};