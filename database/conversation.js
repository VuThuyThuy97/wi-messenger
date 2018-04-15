'use strict';
module.exports = function (sequelize, DataTypes) {
    var Conversation = sequelize.define('Conversation', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    });
    return Conversation;
};
