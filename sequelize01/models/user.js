const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const bcrypt = require("bcrypt");
const User = sequelize.define("users", { ///table name
 
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate :{
            notEmpty :{
                msg:"plz enter fullname"
            },
            isFullname(value){
                if(value.split(" ").length < 2){
                        throw new Error("plz enter name and surname seperately")
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "email taken before"
        },
        validate: {
            notEmpty: {
                msg: "email required"
            },
            isEmail: {
                msg: "wrong email format."
            }
        }
    }
    ,
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "password cant be empty"
            },
            len: {
                args: [5, 10],
                msg: "pw must be between 5-10 chars."
            }
        }
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    timestamps : true
});
 ////hook 
User.afterValidate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});
module.exports = User;