// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const bodyParser = require('body-parser');
const login = require('./login');
const sanitize = require('./sanitize');

const serviceAccount = require('./humanitarian-app-development-firebase-adminsdk-9casr-0ec4d4cdb4.json');

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();

function sendFailure(error) {
	return { "status": "ERROR", "error": error };
}

exports.register = functions.https.onCall((data, context) => {
	if(!sanitize.validPhone(data.phone)){
		return { "status": "FAILED", "error": "MALFORMED PHONE" }; 
	} else if(!sanitize.validUsername(data.username)){
		return { "status": "FAILED", "error": "MALFORMED UNAME" }; 
	} else if(!sanitize.validPass(data.pass)){
		return { "status": "FAILED", "error": "MALFORMED PASS" }; 
	}
	return login.userExists(db, data.username).then(exists => {
		if (exists === true) {
			return { "status": "FAILED", "error": "USER EXISTS" };
		} else {
			return login.hashPassword(data.pass).then(function (hash) {
				return login.addNewUser(db, data.username, data.phone, hash).then(function (val) {
					if (val === true) {
						return { "status": "SUCCESS" };
					} else {
						return { "status": "FAILED", "error": "FAILED TO ADD" };
					}
				}).catch(error => sendFailure(error));
			}).catch(error => sendFailure(error));
		}
	}).catch(error => sendFailure(error));
})

exports.login = functions.https.onCall((data, context) => {
	return login.compareHash(db, data.username, data.pass).then(function (val) {
		if (val) {
			return login.createCustomToken(data.username, db).then(token => {
				console.log("RECEIVED TOKEN: ", token);
				return { "TOK": token, "status": "SUCCESS" };
			}).catch(error => sendFailure(error));
		} else {
			return { "status": "FAILED", "error": "PASSWORD MISMATCH" };
		}
	}).catch(error => sendFailure(error));
})

exports.review = functions.https.onCall((data, context) => {
	return { "TODO": "do this function" }
})