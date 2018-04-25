const PORT = 5000;
const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');

const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const routesApi = require('./routes/index');
const io = require('socket.io')(server);
require('./socket.io/socket.io')(io);
require('./database/db-connect');

app.use(cors());

app.use(express.static('database/upload'));
app.use(bodyParser.json());

app.use('/', routesApi);

server.listen(PORT, function () {
	console.log('\n============================ LISTENING ON PORT ', PORT, '================================\n');
});

