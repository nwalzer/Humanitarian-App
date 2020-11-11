let express  = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('<h1>Welcome to Node.js project setup</h1>')
})

app.listen(3000, function(){
	console.log("Server started on port: 3000")
})