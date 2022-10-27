mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;


const category = new Schema({
  channel_no: String,
  category: [String],
  
});

const Category = mongoose.model('category', category);

module.exports = Category