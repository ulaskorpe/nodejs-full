const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Role = sequelize.define("roles", {
    rolename: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Role;