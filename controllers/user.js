var models = require('../database/db-connect');
var response = require('./response')
var User = models.User;
var Conversation = models.Conversation;
var Message = models.Message;

module.exports.getUserList = function(req, res) {
	User.findAll({
		include: {
			model: Conversation,
			include: { model: User }
		}
	}).then(users=>{
		if(users){
			res.send(response(200, 'SUCCESSFULLY', users));
			// function check(conver) {
			// 	if(conver.Users[0].username==req.decoded.username || conver.Users[1].username==req.decoded.username)
			// 		return true;
			// 	return false;
			// }
			// async.forEachOfSeries(users[0], function(user, idx, _done) {
			// 	user.Conversations = user.Conversations.find(check(conver));
			// 	_done();
			// }, function(err) {
			// 	console.log('done ', users);
			// 	res.send(response(200, 'SUCCESSFULLY', users));
			// });
		} else{
			res.send(response(404, 'NOT FOUND'));
		}
	}).catch(err=>{ 
		res.send(response(404, 'SOMETHING WENT WRONG'));
	});
}
module.exports.getUserByToken = function(req, res) {
	User.findOne({
		where: {
			username: req.decoded.username
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

module.exports.getUserById = function(req, res) {
	User.findOne({
		where: {
			id: req.body.idUser
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
			if(user) {
				user.update({
					active: req.body.active
				}, {
					include: {
						model: Conversation,
						include: [{
							model: Message,
							include: { model: User }
						}, {
							model: User
						}]
					}
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
