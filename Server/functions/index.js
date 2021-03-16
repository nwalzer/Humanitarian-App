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
const db = require('./db');
const sanitize = require('./sanitize');
const mfa = require('./2fa');

const serviceAccount = require('./humanitarian-app-development-firebase-adminsdk-9casr-0ec4d4cdb4.json');

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount)
});

const firestore = firebase.firestore();

function sendFailure(error) {
	return { "status": "ERROR", "error": error };
}

//expecting username, pass
exports.register = functions.https.onCall((data, context) => {
	if(context.auth){
		return {"status": "FAILED", "error": "USER LOGGED IN"}
	}
	
	if(!sanitize.validUsername(data.username)){
		return { "status": "FAILED", "error": "MALFORMED UNAME" }; 
	} else if(!sanitize.validPass(data.pass)){
		return { "status": "FAILED", "error": "MALFORMED PASS" }; 
	}
	return db.userExists(firestore, data.username).then(exists => {
		if (exists === true) {
			return { "status": "FAILED", "error": "USER EXISTS" };
		} else {
			return db.hashPassword(data.pass).then(function (hash) {
				const newSecret = mfa.generateSecret(data.username);
				return db.addNewUser(firestore, data.username, hash, newSecret.secret).then(function (val) {
					if (val === true) {
						return { "status": "SUCCESS", "qr": newSecret.qr };
					} else {
						return { "status": "FAILED", "error": "FAILED TO ADD" };
					}
				}).catch(error => sendFailure(error));
			}).catch(error => sendFailure(error));
		}
	}).catch(error => sendFailure(error));
})

//expecting username, pass, 2FA code
exports.login = functions.https.onCall((data, context) => {
	if(context.auth){
		return {"status": "FAILED", "error": "USER LOGGED IN"}
	}

	return db.compareHash(firestore, data.username, data.pass).then(function (val) {
		if (val !== "") {
			console.log(val);
			return db.getOTP(firestore, val).then((otp) => {
				if(otp !== ""){
					if(mfa.verifyToken(otp, String(data.code))){
						return db.createCustomToken(data.username, firestore).then(token => {
							return { "TOK": token, "status": "SUCCESS" };
						}).catch(error => sendFailure(error));
					} else {
						return { "status": "FAILED", "error": "BAD OTP" };
					}
				} else {
					return { "status": "FAILED", "error": "NO OTP" };
				}
			}).catch(error => sendFailure(error));
		} else {
			return { "status": "FAILED", "error": "PASSWORD MISMATCH" };
		}
	}).catch(error => sendFailure(error));
})

//expecting anon, content, rating, locID
exports.review = functions.https.onCall((data, context) => {
	if(!context.auth){
		return {"status": "FAILED", "error": "NO AUTH"}
	} else if(!sanitize.validRating(data.rating)){
		return {"status": "FAILED", "error": "BAD RATING"}
	} else if(!sanitize.validContent(data.content)){
		return {"status": "FAILED", "error": "BAD CONTENT"}
	} else {

		return db.getUname(firestore, context.auth.uid).then(uname => {
			if (uname === "") {
				return { "status": "FAILED", "error": "USER DNE" };
			} else {
				if(data.anon){
					return db.review(firestore, "Anonymous", data.rating, data.content, data.locID, context.auth.uid);
				} else {
					return db.review(firestore, uname, data.rating, data.content, data.locID, context.auth.uid);
				}
			}
		}).catch(error => sendFailure(error));
	}
})