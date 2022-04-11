const mongoose = require('mongoose');

const paybillSchema = new mongoose.Schema({
  email: String,
  bank_code: String,
  bill_type: String,
  pay_date: Date,
  amount: Number
});

const PaybillModel = mongoose.model('paybill', paybillSchema);

class PaybillOp {
  static async save_bill(email, bank_code, bill_type, amount){
    const payment = new PaybillModel({
      email,
      bank_code,
      bill_type,
      pay_date: Date.now(),
      amount
    });

    return { OK: true, payment: await payment.save() };
  }

  static async bill_history(email){
    const query = await PaybillModel.find({ email }).exec();
    if (query.length === 0) {
      return { OK: false, msg: "bill not found", bill: [] };
    } else {
      return { OK: true, msg: "bill found", bill: query };
    }
  }
}

module.exports = {
  PaybillModel,
  PaybillOp
};