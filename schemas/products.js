let mongoose = require('mongoose');
let productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    description:{
        type: String,
        default:"",
    },
    images:{
        type:[String],
        default:"https://i.imgur.com/cHddUCu.jpeg"
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:'category'
    }
},{
    timestamps:true
})
module.exports = new mongoose.model('product',productSchema)

const express = require("express");
const router = express.Router();
const Product = require("../schemas/products");

// GET: lấy tất cả products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }).populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: lấy 1 product theo id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: tạo product
router.post("/", async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      slug: req.body.slug,
      price: req.body.price,
      description: req.body.description,
      images: req.body.images,
      category: req.body.category
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: update product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: soft delete
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;