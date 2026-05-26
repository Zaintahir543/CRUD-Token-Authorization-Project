const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
 country: { type: String, required: true }, 
  city: { type: String, required: true },
  street: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String },
});


module.exports = AddressSchema;