const PORT = 5000;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var io = require('./socket.io/socket.io')(server);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

require('./server/models/db');
var routesApi = require('./server/routes/index');
var uploadRoutesApi = require('./server/routes/upload');
var authenticate = require('./server/controllers/authenticate/authenticate');

app.use(authenticate());

app.use('/upload', uploadRoutesApi);
app.use('/', routesApi);

server.listen(PORT, function () {
	console.log('listening on port ', PORT);
});

