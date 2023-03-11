const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const transactionsSchema = new mongoose.Schema({
  trans_Id: { type: String, required: true, unique: true, default: uuid() },
  trans_By: { type: String, required: true },
  trans_Type: { type: String, required: true },
  trans_Network: { type: String, required: true },
  phone_number: { type: String },
  trans_amount: { type: Number, required: true },
  balance_Before: { type: Number, required: true },
  balance_After: { type: Number, required: true },
  trans_Date: { type: String },
  trans_Status: { type: String },
  apiResponse: { type: String },
  apiResponseId: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000, // this is the expiry time in seconds(expires in month time)
  },
});

module.exports = Transactions = mongoose.model(
  "transactions",
  transactionsSchema
);
