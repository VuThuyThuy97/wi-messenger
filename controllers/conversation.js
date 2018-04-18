var async = require('async');
var fs = require('fs');
var models = require('../database/db-connect');
var response = require('./response');
var User = models.User;
var Conversation = models.Conversation;
var Message = models.Message;

var create = function(req, res, cb) {
	Conversation.create({
		id: 1,
		title: req.body.title
	}).then(data => {
		// data.setUsers(req.body.idUsers);
		fs.mkdirSync('../database/uploads/' + req.body.title);
		cb(200);
	}).catch(err => { cb(400); });
}
var get = function(req, res, cb) {
	Conversation.findOne({
		where: req.body,
		include: [{
			model: User,
		}, {
			model: Message,
			include: {
				model: User,
			}
		}]
	}).then(data => { if(data) cb(200, data); cb(404)})
	.catch(err => { cb(400);} );
}
var update = function(req, res, cb) {
	Conversation.update(req.body)
	.then(data => { cb(200); })
	.catch(err => { cb(400); });
}
module.exports.getConversation = function (req, res) {
	get(req, res, function(code, data) {
		if(code==400) res.send(response(code, 'SOMETHING WENT WRONG'));
		if(code==200)res.send(response(code, 'SUCCESSFULLY', data));
		if(code==404) res.send(response(code, 'NOT FOUND'));
	});
}
module.exports.createConversation = function (req, res) {
	create(req, res, function(code) {
		if(code!=200) res.send(response(code, 'SOMETHING WENT WRONG'));
		else res.send(response(code, 'SUCCESSFULLY'));
	});
}
module.exports.updateConversation = function (req, res) {
	res.send(response(200, 'SUCCESSFULLY'));
}
module.exports.addUserToConversation = function (req, res) {
	let condition = { title: req.body.title };
	get(condition, res, function(code, data) {
		if(code==400) res.send(response(code, 'SOMETHING WENT WRONG'));
		if(code==200) {
			data.addUsers(req.body.idUsers);
			res.send(response(code, 'SUCCESSFULLY'));
		}
		if(code==404) res.send(response(code, 'NOT FOUND'));
	});
}