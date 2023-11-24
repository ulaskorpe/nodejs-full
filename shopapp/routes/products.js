require("express-async-errors");   /// this must be at top before all

const express = require("express");
const router = express.Router();
 

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");


const {Product, Comment, validateProduct} = require("../models/product");
// const products = [
//     { id: 1, name: "iphone 12", price: 20000 },
//     { id: 2, name: "iphone 13", price: 30000 },
//     { id: 3, name: "iphone 14", price: 40000 }
// ];

//query operators , eq , ne not equal , gt , gte , lt , lte , in [ 1 ,2 ,3 ... ] nin not in

router.get("/",auth, async (req, res,next) => {

  
   throw new Error("some erxxxrr");
    const products = await Product.find()
    .populate("category","name -_id")
    .select("-isActive   -comments.date");
     res.send(products);
     
});

router.post("/", [auth,isAdmin],async (req, res) => {
    const { error } =  validateProduct(req.body);

    if(error) {
        return res.status(400).send(error);
    } 
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isActive: req.body.isActive,
     //   categories : req.body.categories
        category : req.body.category,
        comments : req.body.comments,
    });

    try {
        const newProduct = await product.save();
        res.send(newProduct);
    }
    catch(err) {
        console.log(err);
    }



 
});

///////////////comments section///////////////////////////////

router.put("/comment/:id", auth,async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(404).send("not found.");
    }
    
    const comment = new Comment({
        text: req.body.text,
        username: req.body.username
    });

 // product.comments.push({text:req.body.text,username:req.body.username});
  product.comments.push(comment);

    const updatedProduct = await product.save();
    res.send(updatedProduct);
});

router.delete("/comment/:id",auth, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(404).send("product not found");
    }
    const comment = product.comments.id(req.body.commentid);
    //res.send(comment);
    if(!comment) {
        return res.status(404).send("comment not found");
    }
    product.comments.pull(comment);
    //  product.updateOne(
    //     { _id : req.params.id}, {$pull : { comments :{ commentId : req.body.commentid }}});

     const updatedProduct = await product.save();
     res.send(updatedProduct);
});
///////////////comments section end///////////////////////////////


router.put("/:id", [auth,isAdmin],async (req, res) => {

// const product = await Product.findByIdAndUpdate(req.params.id, {
    //     $set: {
    //         name: req.body.name,
    //         price: req.body.price,
    //         description: req.body.description,
    //         imageUrl: req.body.imageUrl,
    //         isActive: req.body.isActive,
    //     }       
    // }, {new: true});// returns updated data 

    // res.send(product);

    // const result = await Product.update({_id: req.params.id}, {
    //     $set: {
    //         name: req.body.name,
    //         price: req.body.price,
    //         description: req.body.description,
    //         imageUrl: req.body.imageUrl,
    //         isActive: req.body.isActive,
    //     }
    // });

    // res.send(result);

    const product = await Product.findById(req.params.id) ; // products.find(p => p.id == req.params.id);
    if(!product) {
        return res.status(404).send("not found");
    }

    const { error } = validateProduct(req.body);

    if(error) {
        return res.status(400).send(result.error.details[0].message);
    }

    // product.name = req.body.name;
    // product.price = req.body.price;

//    res.send(product);

product.name = req.body.name;
product.price = req.body.price;
product.description = req.body.description;
product.imageUrl = req.body.imageUrl;
product.isActive = req.body.isActive;
product.category = req.body.category;
product.comments = req.body.comments;
//product.categories = req.body.categories;
const updatedProduct = await product.save();

res.send(updatedProduct);
});

router.delete("/:id",[auth,isAdmin],async (req, res) => {
   // const product = products.find(p => p.id == req.params.id);
   const product = await Product.findByIdAndDelete(req.params.id);

    if(!product) {
        return res.status(404).send("not found");
    }

    // const index = products.indexOf(product);
    // products.splice(index, 1);
    res.send(product);
});

router.get("/:id", auth,async (req, res) => {
  //  const product = products.find(p => p.id == req.params.id);
  //const product = await Product.findOne({_id:req.params.id});
  const product = await Product.findByIdAndDelete(req.params.id).populate("category","name -_id");

  ////deleteMany({criter}) deleteOne
    if(!product) {
        return res.status(404).send("not found");
    }
    res.send(product);
});

 
module.exports = router;