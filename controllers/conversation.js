var async = require('async');
var models = require('../database/db-connect');
var response = require('./response');
var User = models.User;
var Conversation = models.Conversation;
var Message = models.Message;

// module.exports.getConversationList = function(req, res){
// 	User.findOne({
// 		include: {
// 			model: Conversation,
// 			include : {model: User}
// 		},
// 		where: {
// 			email: req.params.email
// 		}
// 	}).then(data => {
// 		res.send(data.Conversations);
// 	}).catch(err => {
// 		res.send('err');
// 	})
// }

module.exports.getConversation = function(req, res) {
    Conversation.findById(req.body.idConversation,{
		include: [{
			model: User,
		}, {
			model: Message,
			include: {
				model: User,
			}
		}]
	}).then(conver=>{
		if(conver){
			res.send(response(200, 'SUCCESSFULLY', conver));
		} else{
			res.send(response(404, 'CONVERSATION NOT FOUND'));
		}
    }).catch(err=>{
		res.send(response(404, 'SOMETHING WENT WRONG'));
    })
}
module.exports.createConversation = function (req,res) {
	Conversation.findOne({
		where: { id: req.body.id },
		include: [{
			model: Message,
			include: { model: User }
		}, {
			model: User
		}]
	}).then(conver=>{
		if(conver)
			res.send(response(400, 'COVERSATION EXISTED', conver));
		else {
			Conversation.create({
				id: req.body.id,
				title: req.body.title
			}).then(data=>{
				let ids = req.body.idUsers;
				data.setUsers(ids);
				res.send(response(200, 'SUCCESSFULLY', req.body.id));
				// Conversation.findOne({
				// 	where: { id: req.body.id },
				// 	include: [{
				// 		model: Message,
				// 		include: { model: User }
				// 	}, {
				// 		model: User
				// 	}]
				// }).then(con=>{
				// 	res.send(response(200, 'SUCCESSFULLY', con));
				// }).catch(err=>{
				// 	res.send(response(400, 'CONVERSATION NOT FOUND'));
				// });
			}).catch(err=>{
				res.send(response(404, 'SOMETHING WENT WRONG'));
			});
		}
	}).catch(err=> {

	});
}
module.exports.updateConversation = function(req,res) {
	Conversation.findById(req.body.idConversation, {
		include: User
	}).then(conversation=>{
		if(conversation && conversation.Users.find(function(user){return user.id === req.decoded.id})) {
			conversation.update({
				title: req.body.title || conversation.title,
				avatar: req.body.avatar || conversation.avatar
			})
			.then(conversation => {
				res.send(response(200, 'SUCCESSFULLY', conversation));
			}).catch(err=>{
				res.send(response(404, 'SOMETHING WENT WRONG'));
			})
		} else {
			res.send(response(404, 'CONVERSATION NOT FOUND'));
		}
	}).catch(err=>{
		res.send(response(404, 'SOMETHING WENT WRONG'));
	})
}
module.exports.addUserToConversation = function(req,res) {
	Conversation.findById(req.body.idConversation)
		.then(function(conversation) {
			if(conversation){
				let ids = req.body.idUsers;
				conversation.addUsers(ids);
				Conversation.findOne({ id: conversation.id }, {
					include: [{
						model: Message,
						include: { model: User }
					}, {
						model: User
					}]
				}).then(conver=>{
					res.send(response(200, 'SUCCESSFULLy', conver));
				}).catch(err=>{
					res.send(response(400, 'CONVERSATION NOT FOUND'));
				});
			} else{
				res.send(response(404,'CONVERSATION NOT FOUND'));
			}	
		}).catch(err=>{
			res.send(response(404, 'SOMETHING WENT WRONG'));
		});
}