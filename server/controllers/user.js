var models = require('../models/db');
var md5 = require('md5');
var response = require('../response')
var Op = models.Op;
var User = models.User;

module.exports.getUserList = function(req, res) {
	User.findAll().then(users=>{
		if(users){
			res.send(response(200, 'SUCCESSFULLY', users));
		} else{
			res.send(response(404, 'NOT FOUND'));
		}
	}).catch(err=>{ 
		res.send(response(404, 'SOMETHING WENT WRONG'));
	});
}
module.exports.getUserById = function(req, res) {
	User.findById(req.body.idUser, {
		include: {
			model: models.Conversation,
			include: models.Message
		}
	}).then(user=> {
		if(user && user.id === req.decoded.id){	
			res.send(response(200, 'SUCCESSFULLY', user));
		} else {
			res.send(response(404, 'USER NOT FOUND'));
		}
	}).catch(err=>{
		res.send(response(404, 'SOMETHING WENT WRONG'));
	});
}

module.exports.editUser = function (req, res) {
	User.findById(req.body.idUser)
		.then(user=>{
			if(user && req.decoded.id === user.id) {
				if(req.body.password){
					req.body.password = md5(req.body.password);
				}
				user.update({
					username: req.body.username || user.username,
					password: req.body.password || user.password,
				})
				.then(user => {
					res.send(response(200, 'SUCCESSFULLY', user));
				})
			} else {
				res.send(response(404, 'USER NOT FOUND'));
			}
		}).catch(err=>{
			res.send(response(404, 'SOMETHING WENT WRONG'));
		})
}