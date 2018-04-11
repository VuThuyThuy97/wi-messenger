var async = require('async');
var models = require('../models/db');
var response = require('../response');
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
			model: models.Message,
			include: {
				model: User,
			}
		}]
	}).then(data=>{
		if(data && data.Users.find(function(user){return user.id === req.decoded.id})){
			res.send(response('200', 'SUCCESSFULLY', data));
		} else{
			res.send(response('404', 'CONVERSATION NOT FOUND'));
		}
    }).catch(err=>{
		res.send(404, 'SOMETHING WENT WRONG');
    })
}
module.exports.createConversation = function (req,res) {
	Conversation.create({
		title: req.body.title,
		avatar: req.body.avatar
	}).then(data=>{
		let ids = req.body.idUsers;
		data.setUsers(ids);
		res.send(data);
	}).catch(err=>{});
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
	Conversation.findById(req.body.idConversation, {
		include: User
	}).then(function(conversation) {
		if(conversation && conversation.Users.find(function(user){return user.id === req.decoded.id})){
			let ids = req.body.idUsers;
			conversation.addUsers(ids);
			res.send(response(200,'SUCCESSFULLY', conversation));
			// async.series([function(callback){
			// 	let ids = req.body.idUsers;
			// 	conversation.addUsers(ids);
			// 	callback(null, null);
			// }, function (callback){
			// 	Conversation.findById(req.body.idConversation, {
			// 		include: User
			// 	}).then(function (newCon) {
			// 		console.log('found', newCon.Users);
			// 		callback(null, newCon);
			// 	})
			// }], function(err, result){
			// 	if(err){
			// 		res.send(response(404, 'SOMETHING WENT WRONG'));
			// 	}else {
			// 		res.send(response(200,'SUCCESSFULLY', result));						
			// 	}
			// })
		} else{
			res.send(response(404,'CONVERSATION NOT FOUND'));
		}	
	}).catch(err=>{
		console.log('+++err', err);
		res.send(response(404, 'SOMETHING WENT WRONG'));
	})
}