var express = require('express');
var router = express.Router();

var ctrlUpload = require('../controllers/upload.js');

router.post('/file', function(req, res){
    ctrlUpload.postFile(req,res);
})
router.post('/image', function(req,res){
    ctrlUpload.postImage(req,res);
})
router.post('/avatar', function(req, res) {
    ctrlUpload.postAvatar(req, res);
})
module.exports = router;