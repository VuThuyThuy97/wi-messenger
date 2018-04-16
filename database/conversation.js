'use strict';
module.exports = function (sequelize, DataTypes) {
    var Conversation = sequelize.define('Conversation', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        type: {
            type: DataTypes.STRING
        }
    });
    return Conversation;
};
