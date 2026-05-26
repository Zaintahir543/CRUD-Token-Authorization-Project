const mongoose = require('mongoose');
const ContactSchema = require('./contact')
const AddressSchema = require('./address')



const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contacts: [ContactSchema],
    // address: [AddressSchema],
    profile: { type: String, default: null },

    // ✅ OTP fields yahan hi add honge
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true } // ✅ ye options alag object me hote hain
);

module.exports = mongoose.model('Users', UserSchema);
