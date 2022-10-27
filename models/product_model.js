mongoose = require("mongoose");
const Shop = require('./shop_model.js')


//Define a schema
const Schema = mongoose.Schema;


const ProductSchema = new Schema({
  _id: String,
  sub_category: String,
  product_name: String,
  product_description: String,
  price:String,
  owner:String,
  shop: String,
  image_url:[]
});

const Product = mongoose.model('products', ProductSchema);

module.exports = Product