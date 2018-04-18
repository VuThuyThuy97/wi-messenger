var formidable = require('formidable');
var fs = require('fs');
var jsonResponse = require('./response');

module.exports.postFile = function(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function(name, file) {
        file.name = Date.now() + '_' + file.name;
        file.path = "./database/uploads/file/" + file.name;
    })
    form.on('file', function(name, file){
        res.json({
            status: 100,
            content: 'file/'+file.name
        });
    })
    form.on('error', function (err) {
        res.json({
            status: 101
        });
    });
    form.on('end', function () {
    });
}
module.exports.postImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function(name, file) {
        file.name = Date.now() + '_' + file.name;
        file.path = "./database/uploads/image/" + file.name;
    })
    form.on('file', function(name, file){
        res.json({
            status: 100,
            content: 'image/'+file.name
        });
    })
    form.on('error', function (err) {
        res.json({status: 101});
    });
    form.on('end', function () {
    });
}
module.exports.postAvatar = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function(name, file) {
        file.name = Date.now() + '_' + file.name;
        file.path = "./database/uploads/avatar/" + file.name;
    })
    form.on('file', function(name, file){
        console.log('uploaded avatar', file.name);
        res.json({
            status: 100,
            content: 'avatar/'+file.name
        });
    })
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
        res.json({status: 101});
    });
    form.on('end', function () {
        console.log('done upload!');
    });
}