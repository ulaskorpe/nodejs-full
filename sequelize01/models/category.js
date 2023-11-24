const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define("categories", { ///table name
 
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps : false
});
 

module.exports = Category;