'use strict';
var fs = require('fs');
var md5 = require('md5');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var sequelize = new Sequelize("chat_angular", "root", "", {
    dialect: 'sqlite',
    storage: path.join(__dirname, 'chat_angular.sqlite')
});
var Op = Sequelize.Op;
var db = {};
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


db.Conversation.belongsToMany(db.User, {
    through : 'user_conversation',
    foreignKey: 'conversation_id'
});
db.User.belongsToMany(db.Conversation, {
    through : 'user_conversation',
    foreignKey: 'user_id'
});
db.Conversation.hasMany(db.Message, {
    foreignKey: {
        name: 'conversation_id',
        allowNull: false
    }
})
db.Message.belongsTo(db.Conversation, {
    foreignKey: {
        name: 'conversation_id',
        allowNull: false
    }
});
db.User.hasMany(db.Message, {
    foreignKey: {
        name: 'sender_id',
        allowNull: false
    }
})
db.Message.belongsTo(db.User, {
    foreignKey: 'sender_id',
    targetKey: 'id'
});
sequelize.sync().then(()=>{
    db.User.create({
        id: 1,
        username: 'Admin',
        password: md5('a'),
    }).then(data=>{
        
    }).catch(err=>{});
    db.Conversation.create({
        id: 1,
        title: 'Chat app',
    }).then(data=>{
        let ids = [1];
        data.setUsers(ids);
        res.send(data);
    }).catch(err=>{});
    db.Message.create({
        id: 1,
        message: 'Hello',
        message_type: 'text',
        conversation_id: 1,
        sender_id : 1
    }).then(data=>{
        
    }).catch(err=>{});
    console.log('sync success', db.User);
}).catch(err=>{
    console.log('sync err');
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;

module.exports = db;
