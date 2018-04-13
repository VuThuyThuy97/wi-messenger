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
module.exports.getUser = function(req, res) {
	User.findOne({
		where: {
			username: req.decoded.username
		},
		include: {
			model: models.Conversation,
			include: {
				model: models.Message,
				include: {
					model: models.User
				}
			}
		}
	}).then(user=> {
		if(user){	
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
