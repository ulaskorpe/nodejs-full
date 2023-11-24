const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.json());/// incoming data is json

// http methods: get, post, put, delete

const products = [
    { id: 1, name: "iphone 12", price: 20000 },
    { id: 2, name: "iphone 13", price: 30000 },
    { id: 3, name: "iphone 14", price: 40000 }
];

app.get("/", (req, res) => {
    res.send(products[0]);
});

app.get("/api/products", (req, res) => {
    res.send(products);
});

app.post("/api/products", (req, res) => {
    // if(!req.body.name || req.body.name.length < 4){
    //     res.status(400).send("not valid data!");
    // }
    // const schema = new Joi.object({
    //     name : Joi.string().min(3).max(30).required(),
    //     price : Joi.number().integer().min(100).max(1000000).required()
    // });

    // const result = schema.validate(req.body);

    const { error } = validateProduct(req.body);

    if(error) {
        res.status(400).send( error.details[0].message);
        return;
    }

    // if(result.error){
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // } 
    const product = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(product);
    res.send(products);
    
});
function validateProduct(product) {
    const schema = new Joi.object({
        name: Joi.string().min(3).max(30).required(),
        price: Joi.number().required()
    });

    return schema.validate(product);
}

app.put("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if(!product) {
        res.status(404).send("prodct not found.");
    }

    const { error } = validateProduct(req.body);

    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    product.name = req.body.name;
    product.price = req.body.price;

    res.send(products);
});


app.delete("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if(!product) {
        return res.status(404).send("product not found");
    }

    const index = products.indexOf(product);
    products.splice(index, 1);
    res.send(products);
});


app.get("/api/products/:id", (req, res) => {
    console.log(req.params);
    console.log(req.query);

    const product = products.find(p => p.id == req.params.id);

    if(!product) {
        res.status(404).send("aradığınız ürün bulunamadı.");
    }
    res.send(product);
});



app.listen(3000, () => {
    console.log("listening on port 3000");
});