mongoose = require("mongoose");


const Schema = mongoose.Schema;

shop = new Schema({
  _id: String,
  name: String,
  imgUrl:String,
  Owner: String
});

const Shop =  mongoose.model('shops',shop);
module.exports =  Shop;