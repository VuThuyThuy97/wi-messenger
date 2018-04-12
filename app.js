const PORT = 7000;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(server);

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

io.on('connection', function (socket) {
	console.log('Connection!');
	socket.on('listRoom', function (data) {
		data.forEach(function(room) {
			socket.join(room.id);
		});
	});
	// socket.on('test', function (params) {
	// 	console.log('test');
	// })
	socket.on('sendMessage', function(data){
		
		// console.log(data.content);
		io.in(data.conversation.id).emit('receiveMessage', data);
	});
	socket.on('joinRoomAdded', function (data) {
		socket.join(data.id);
	})
	socket.on('addConver', function (data) {
		console.log(data.id);
		socket.join(data.conver.id);
		if(data.conver.Users.length==1){
			data.conver.title = data.sender.username;
			data.conver.avatar = data.sender.avatar;
		}
		socket.broadcast.emit('addListConver', data);
	});
	socket.on('addUser', function (data) {
		io.sockets.emit('addUserToConver', data);
	});
	socket.on('joinRoom', function(data){
		socket.join(data.conver.id);
	})
});
