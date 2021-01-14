// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express  = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const login = require('./login');
const email = require('./email');

let app = express();
app.use(bodyParser.json());
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

const firebaseApp = firebase.initializeApp();
const db = firebase.database();

app.get('/', function(req, res) {
    res.set('Cache-control', 'public, max-age=300, s-maxage=600');
	res.render('index', {date: Date.now()})
})

app.post('/register', function(req, res){
	login.userExists(db, req.body.username).then(function(exists){
		console.log("EXISTS: " + exists);
		if(exists === true){
			res.send('User Exists');
		} else {
			login.hashPassword(req.body.pass).then(function(hash){
				login.addNewUser(db, req.body.username, req.body.phone, req.body.email, hash).then(function(val){
					if(val === true){
						email.registerUser(req.body.username, req.body.pass, req.body.phone, req.body.email);
						res.send('Success');
					} else {
						res.send('Failed');
					}
					return;
				}).catch(error => sendFailure(res, error));
				return;
			}).catch(error => sendFailure(res, error));
		}
		return;
	}).catch(error => sendFailure(res, error));
})

app.post('/login', function(req, res){
	login.compareHash(db, req.body.username, req.body.pass).then(function(val){
		console.log(val);
		if(val){
			res.send("SUCCESS");
		} else {
			res.send("FAILED");
		}
		return;
	}).catch(error => sendFailure(res, error));
})

app.post('/review', function(req, res){
	//TODO: implement
	res.send('Success')
})
app.get('/ping', function(req, res) {
	res.send("Ping successful!");
})

function sendFailure(res, error){
	console.log(error);
	res.send('Failed');
}

exports.app = functions.https.onRequest(app);
