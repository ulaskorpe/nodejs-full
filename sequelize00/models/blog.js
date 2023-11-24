const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blogs", {
    // id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     allowNull: false,
    //     primaryKey: true
    // },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    home: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
   
},{
    timestamps : false
});

module.exports = Blog;