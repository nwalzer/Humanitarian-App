// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const firebase = require('firebase-admin');
let express  = require('express');
let app = express();
//let login = require('../Database/login')

const firebaseApp = firebase.initializeApp(functions.config().firebase);

app.get('/', function(req, res) {
	res.send('<h1>Connected successfully</h1>')
})

app.post('/register', function(req, res){
	//TODO: implement
	res.send('Success')
})

app.post('/login', function(req, res){
	//TODO: implement
	res.send('Success')
})

app.post('/review', function(req, res){
	//TODO: implement
	res.send('Success')
})
app.get('/ping', function(req, res) {
    //login.hashPassword("HELLO").then(val => console.log(val)).catch(error => console.log(error));
	res.send("Ping successful!")
})

exports.app = functions.https.onRequest(app);
