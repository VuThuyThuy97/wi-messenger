var models = require('../database/db-connect');
var response = require('./response')
var Message = models.Message;
var User = models.User;
var Conversation = models.Conversation;

module.exports.sendMessage = function (req, res) {
	Conversation.findById(req.body.idConversation, {
		include: {
			model: User,
			through: {
				attributes: ['conversation_id', 'user_id'],
			}
		}
	}).then(conversation => {
		if(conversation){
			Message.create({
				message: req.body.message,
				message_type: req.body.messageType,
				conversation_id: req.body.idConversation,
				sender_id : req.body.idUser,
				createdAt: new Date()
			}).then(message => {
				if(message)
					Message.findOne({
						where: { id: message.id },
						include: { model: User }
					}).then(data=>{
						res.send(response(200, 'SUCCESSFULLY', data));
					}).catch(err=> {

					});
				else
					res.send(response(404, 'SOMETHING WENT WRONG'));
			}).catch(err => {
				res.send(response(404, 'CREATE MESSAGE FAIL', err));
			});
		} else {
			res.send(response(404, 'CONVERSATION NOT FOUND'));
		}
	}).catch(err=>{
		res.send(response(404, 'SOMETHING WENT WRONG'));
	})
}
module.exports.getMessage = function (req, res) {
	Message.findAll({
		include: {
			model: models.Conversation,
			include: {
				model: models.User,
				through: {
					attributes: ['conversation_id', 'user_id'],
				}
			}
		},
		where: {
			conversation_id: req.body.idConversation
		},
	}).then(data => {
		if(data){
			let rs = [];
			for(d of data){
				if(d.Conversation.Users.find(function(user){return user.id === req.decoded.id})){
					rs.push(d);
					if(d===data[data.length-1] && rs.length>0){
						res.send(200, 'SUCCESSFULLY', rs);
					} else {
						res.send(404, 'MESSAGES NOT FOUND');
					}
				}
			}
			
		} else {
			res.send(response(404, 'CONVERSATION NOT FOUND'));
		}
	}).catch(err => {
		res.send(response(404, 'SOMETHING WENT WRONG'));
	});
}