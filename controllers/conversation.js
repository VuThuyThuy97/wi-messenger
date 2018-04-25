var fs = require('fs');
var models = require('../database/db-connect');
var response = require('./response');
var User = models.User;
var Conversation = models.Conversation;
var Message = models.Message;

module.exports.getConversation = (req, res) => {
	Conversation.findOne({
		where: { name: req.body.name },
		include: {
			model: Message,
			include: {
				model: User
			}
		}
	}).then(conver => {
		if (conver) {
			conver.setUsers(req.body.idUser);
			res.send(response(200, 'SUCCESSFULLY', conver));
		} else {
			fs.mkdirSync('database/upload/' + req.body.name, 0o776);
			Conversation.create({
				name: req.body.name
			}).then(conver => {
				conver.setUsers(req.body.idUser);
				res.send(response(200, 'SUCCESSFULLY', conver));
			}).catch(err => {
				res.send(response(400, 'SOMETHING WENT WRONG 2'));
			});

		}
	}).catch(err => {
		res.send(response(400, 'SOMETHING WENT WRONG 1'));
	})
}
