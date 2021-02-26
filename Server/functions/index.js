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

function sendFailure(error){
	return {"status": "ERROR", "message":error};
}

exports.register = functions.https.onCall((data, context) => {
	return login.userExists(db, data.username).then(exists => {
		console.log("EXISTS: " + exists);
		if(exists === true){
			res.send({"status":"FAILED"});
		} else {
			login.hashPassword(data.pass).then(function(hash){
				login.addNewUser(db, data.username, data.phone, data.email, hash).then(function(val){
					if(val === true){
						return {"status":"SUCCESS"};
					} else {
						return {"status":"FAILED"};
					}
				}).catch(error => sendFailure(error));
			}).catch(error => sendFailure(error));
		}
	}).catch(error => sendFailure(error));
})

exports.login = functions.https.onCall((data, context) => {
	return login.compareHash(db, data.username, data.pass).then(function(val){
		if(val){
			login.createCustomToken(data.username, db).then(token => {
				console.log("RECEIVED TOKEN: ", token);
				return {"TOK": token, "status":"SUCCESS"};
			}).catch(error => sendFailure(res, error));
		} else {
			console.log("failing");
			return {"status":"FAILED"};
		}
	}).catch(error => sendFailure(error));
})

exports.review = functions.https.onCall((data, context) => {
	return {"TODO":"do this function"}
})