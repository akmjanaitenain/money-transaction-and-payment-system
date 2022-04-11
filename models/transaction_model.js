const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date_time: Date,
  amount: Number,
  sender_email: String,
  receiver_email: String,
  transaction_type: String
});

const TransactionModel = mongoose.model('transaction', transactionSchema);

class TransactionOp {
  static async save_transaction(amount, sender_email, receiver_email, transaction_type){
    const transaction = new TransactionModel({
      date_time: Date.now(),
      amount,
      sender_email,
      receiver_email,
      transaction_type
    });

    return { OK: true, transaction: await transaction.save() };
  }

  static async retrieve_history(user) {
    const query = await TransactionModel.find({ $or: [{ sender_email: user }, { receiver_email: user }] }).exec();
    if (query.length === 0) {
      return { OK: false, msg: "history not found", history: [] };
    } else {
      return { OK: true, msg: "history found", history: query };
    }
  }

}

module.exports = {
  TransactionModel,
  TransactionOp
};