const express = require("express");
const { default: mongoose } = require("mongoose");
const router = new express.Router();
const Product = require("../models/product");
const CoreList = require("./CoreList");

router.post("/product/list", async (req, res) => {
  let result = await CoreList(Product, req, "company");
  res.send(result);
});

router.post("/product/create", async (req, res) => {
  let newProduct = req.body;
  let product_name = newProduct.product_name;
  let product_category = newProduct.product_category;
  try {
    const takenProduct = await Product.findOne({
      product_name: product_name,
      product_category: product_category,
    });
    if (takenProduct) {
      res.status(406).send({ message: "Firma önceden eklenmiş" });
    } else {
      const product = new Product(newProduct);
      try {//aynı yav  hee bi sn 
        await product.save();// şurası patlıyor product.save not a function diyor burada validaton yapmıyor mu validation ı orası yapıyor direkt modelde yapıyor anladım da bilemedim yani Product geriye bir şey de döndürmüyor patlıyor dedin tam çözemedim 
        res.status(200).send({ product });
      } catch (e) {
        console.log(e);
        res.status(400).send(e);
      }
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/product/update", async (req, res) => {
  let result = await Product.updateOne({ _id: req.body.id }, req.body);
  res.send({ message: "Başarıyla güncellendi" });
});

router.post("/product/delete", async (req, res) => {
  let result = await Product.findByIdAndDelete(req.body.id);
  res.send({ message: "Başarıyla silindi" });
});

module.exports = router;
