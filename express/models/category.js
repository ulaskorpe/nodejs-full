const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define("categories", { ///table name
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps : false
});

async function sync() {
   // await Category.sync({ force: true }); //// this is migration 
   // await Category.sync({ alter: true }); //// updates if exists
    //console.log("category table added");
    // const c1 = await Category.build({  //// and this is seeder 
    //     name : "new category 1 "
    // });
    // await c1.save();
    ///create method 
    //const count = Category.count() ;  
    //if(count  == 0  ) { }
    //await Category.create({name : "new category"});

    //Category.bulkCreate({name:"new 1"},{name:"cat 2 "})
}

// sync();

module.exports = Category;