const express = require("express");
const app = express();

const mongoose = require("mongoose");
//const cors = require("cors");
const products = require("./routes/products");
const home = require("./routes/home");

app.use(express.json());

///without cors package
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET");
    next();

})

/// with cors package
// app.use(cors({
//     origin: "*",
//     methods: ["GET","POST"]
// }));
/// mongose = sequelize  
///mongodb+srv://ulaskorpe:RApiGAkDDVGs506Z@cluster0.ctcvnlf.mongodb.net/?retryWrites=true&w=majority // this is cloud
mongoose.connect("mongodb://ulaskorpe:123123@192.168.56.56:27017/shopapp")// this is vm 
.then(()=>{console.log("connected mongodb")} ).catch((err)=>{console.log(err)});



const productSchema = mongoose.Schema({
    name : String,
    price : Number,
    description : String,
    imageUrl : String,
    date : {
        type : Date ,
        default : Date.now
    },
    isActive : Boolean
});


const Product = mongoose.model("Product",productSchema); // model created via schema

const prd = new Product({name : "iphone14",price : 30000, description:"some desc",imageUrl:"1.jpg",isActive:true});

async function  saveProduct(){
    try{
    const result = await prd.save();
        console.log(result);
    }catch(err){
        console.log(err);
    }
}

saveProduct();

app.use("/api/products" ,products);
app.use("/", home);

app.listen(3000, () => {
    console.log("listening on port 3000");
});