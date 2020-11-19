let express  = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('<h1>Welcome to Node.js project setup</h1>')
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

app.listen(3000, function(){
	console.log("Server started on port: 3000")
})