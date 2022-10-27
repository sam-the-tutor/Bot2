mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;


const subSchema = new Schema({

  _id:String,
  sub_name: String,
 
});

const Sub = mongoose.model('sub_category', subSchema);

module.exports = Sub