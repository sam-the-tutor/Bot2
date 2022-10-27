mongoose = require("mongoose");


const Schema = mongoose.Schema;

subscriber = new Schema({
  channel_no: {type:String, required:true},
  location: String,
  sub_shop_id: {type: String, required: true},
  verified:{
    type: Boolean,
    default: false
  }
});

const Subscriber =  mongoose.model('subscribers',subscriber);
module.exports =  Subscriber;