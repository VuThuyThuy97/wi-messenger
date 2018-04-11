var models = require('../models/db');
var response = require('../response')
var Message = models.Message;
var Conversation = models.Conversation;

module.exports.sendMessage = function (req, res) {
	Conversation.findById(req.body.idConversation, {
		include: {
			model: models.User,
			through: {
				attributes: ['conversation_id', 'user_id'],
			}
		}
	}).then(conversation => {
		if(conversation && conversation.Users.find(function(user){return user.id = req.decoded.id})){
			Message.create({
				message: req.body.message,
				message_type: req.body.messageType,
				conversation_id: req.body.idConversation,
				sender_id : req.decoded.id
				
			}).then(message => {
				res.send(message);
			}).catch(err => {
				console.log('--err', err);
				res.send(response(404, 'CREATE MESSAGE FAIL'));
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