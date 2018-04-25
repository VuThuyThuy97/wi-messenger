var models = require('../database/db-connect');
var response = require('./response')
var Message = models.Message;
var User = models.User;
var Conversation = models.Conversation;

module.exports.postMessage = (req, res) => {
	Message.create({
		content: req.body.content,
		type: req.body.type,
		idConversation: req.body.idConversation,
		idSender: req.body.idSender
	}).then(message => {
		if (message)
			res.send(response(200, 'SUCCESSFULLY', message));
		else
			res.send(response(404, 'SOMETHING WENT WRONG'));
	}).catch(err => {
		res.send(response(404, 'CREATE MESSAGE FAIL', err));
	});
}
