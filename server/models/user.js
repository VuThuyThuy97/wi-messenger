module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        islogin: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 0
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        }
    });

};
