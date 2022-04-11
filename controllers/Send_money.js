const Transaction = require("./Transaction");
const { sessExist } = require("../utils/common");
const { UserOp } = require("../models/user_model");

class Send_money {
  constructor(user_email, date, amount){
    this.email = user_email;
    this.date = date;
    this.amount = amount;
    this.type = "SEND";
  }

  static async send_money(req, res) {
    if (!sessExist(req)) {
      res.redirect('/login');
    } else {
      let { key, role } = req.session.user;
      let amount = parseInt(req.body.amount);
      let sender_email = key;
      let receiver_email = req.body.email;
      const result = await Transaction.do_transaction(amount, sender_email, receiver_email, "gen");
      const user = await UserOp.find_user(key);
      if (user.OK) {
        res.render('../views/dashboard', { user: user.user, msg: result.OK ? 'Transaction successful' : `Transaction failed (${result.msg})`, title: 'Dashboard' });
      } else {
        res.render('../views/500', { msg: 'User not found' });
      }
    }
  }
}

module.exports = Send_money;