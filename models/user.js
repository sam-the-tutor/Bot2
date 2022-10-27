mongoose = require("mongoose");



//Define a schema
const Schema = mongoose.Schema;






//initializing a categories Model

//initialising the schema layout
const layer1 = new Schema({
  name: String,
  Sub_category:[{
    name:String
  }]
});

//creating a layer1 schema in the database
const layer1Model = mongoose.model('categories', layer1);


// //shop schema
// shop = new Schema({
//   name: String,
//   sub_category: String,
//   imgUrl: String,
//   owner: String,
//   Description: String
// });

// const Shop =  mongoose.model('shops',shop);
// module.exports =  Shop;

//



//initializing the products schema model

// const ProductSchema = new Schema({
//   sub_category: String,
//   product_name: String,
//   product_description: String,
//   price: String,
//   image_url: String
// });

// const Product = mongoose.model('products', ProductSchema);

// module.exports = Product

//Define a schema for Users

const Users_Schema = new Schema({
  fname: {
    type:String
    },

  lname: {
    type:String,
    },

  email_address: {
    type:String,
    },
  Whatsapp_number: {
    type:String,
    },
  password: {
    type:String,
    },
    
  Date_joined: {
    type:String,
    default: Date.now},

  profilepic: String
});
const User = mongoose.model('User', Users_Schema);
module.exports = User


