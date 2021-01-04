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
//let login = require('../Database/login')

let app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

const firebaseApp = firebase.initializeApp(functions.config().firebase);

app.get('/', function(req, res) {
    res.set('Cache-control', 'public, max-age=300, s-maxage=600');
	res.render('index', {date: Date.now()})
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
