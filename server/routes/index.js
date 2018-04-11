var express = require('express');
var router = express.Router();

var ctrlMessage = require('../controllers/message');
var ctrlConversation = require('../controllers/conversation');
var ctrlUser = require('../controllers/user');

//user
router.post('/user/list', function(req,res) {
	ctrlUser.getUserList(req,res);
})
router.post('/user/info', function(req, res) {
	ctrlUser.getUserById(req,res);
})
router.put('/user/edit', function(req, res){
	ctrlUser.editUser(req, res);
})
//chat
router.post('/conversation/message/list', function (req,res) {
	ctrlMessage.getMessage(req,res);
})
router.post('/conversation//message/new', function(req,res) {
	ctrlMessage.sendMessage(req,res);
});

//Conversation
router.post('/conversation/new', function(req,res) {
	ctrlConversation.createConversation(req,res);
});
router.put('/conversation/edit', function(req,res) {
	ctrlConversation.updateConversation(req,res);
});
router.post('/conversation/info', function(req, res){
	ctrlConversation.getConversation(req, res);
});
router.put('/conversation/user/add', function(req,res) {
	ctrlConversation.addUserToConversation(req,res);
})

module.exports = router;