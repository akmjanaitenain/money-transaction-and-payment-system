const { PaybillOp } = require("../models/bill_payment_model");
const { UserOp } = require("../models/user_model");
const Bank = require("../controllers/Bank");
const { sessExist } = require("../utils/common");

class Bill_payment {
  constructor(code, date, type, amount){
    this.code = code;
    this.date = date
    this.type = type;
    this.amount = amount
  }

  static async paybill(email, bank_code, bill_type, amount) {
    const attempt = await PaybillOp.save_bill(email, bank_code, bill_type, amount);
    if (!attempt.OK) {
      // console.log("attempt");
      return attempt;
    }

    const sender = await UserOp.modify_balance(email, -amount);
    if (!sender.OK) {
      // console.log("sender");
      return sender;
    }

    return { OK: true, msg: "Bill payment successful" };
  }

  static async paybill_action(req, res) {
    if (!sessExist(req)) {
      res.redirect('/login');
    } else {
      let { key, role } = req.session.user;
      let payer_email = key;
      let amount = parseInt(req.body.amount);
      let bank_code = req.body.bank_code;
      let bank_type = req.body.bank_type;
      const result = await Bill_payment.paybill(payer_email, bank_code, bank_type, amount);
      const user = await UserOp.find_user(key);
      if (user.OK) {
        res.render('../views/dashboard', { user: user.user, msg: result.OK ? 'Payment successful' : `Payment failed (${result.msg})`, title: 'Dashboard' });
      } else {
        res.render('../views/500', { msg: 'User not found' });
      }
    }
  }

  static async bill_history_action(req, res) {
    if (!sessExist(req)) {
      res.redirect('/login');
    } else {
      let { key, role } = req.session.user;
      const history = await PaybillOp.bill_history(key);
      const user = await UserOp.find_user(key);
      if (user.OK) {
        res.render('../views/bill_history', { history: history.bill.map(map_history), msg: null, title: 'Bill History' });
      } else {
        res.render('../views/500', { msg: 'User not found' });
      }
    }
  }
}

const map_history = (val) => {
  return new Bill_payment(
    Bank.get_bank_name(val.bank_code),
    val.pay_date,
    Bank.get_bill_type(val.bill_type),
    val.amount
  );
}

module.exports = Bill_payment;