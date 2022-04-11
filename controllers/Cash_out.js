const Transaction = require("./Transaction");
const { sessExist } = require("../utils/common");
const { UserOp } = require("../models/user_model");

class Cash_out {
  constructor(agent_email, date, amount){
    this.email = agent_email;
    this.date = date;
    this.amount = amount;
    this.type = "CASHOUT";
  }

  static async cash_out(req, res) {
    if (!sessExist(req)) {
      res.redirect('/login');
    } else {
      let { key, role } = req.session.user;
      let amount = parseInt(req.body.amount);
      let sender_email = key;
      let agent_email = req.body.email;
      const result = await Transaction.do_transaction(amount, sender_email, agent_email, "csh");
      const user = await UserOp.find_user(key);
      if (user.OK) {
        res.render('../views/dashboard', { user: user.user, msg: result.OK ? 'Cash out successful' : `Cash out failed (${result.msg})`, title: 'Dashboard' });
      } else {
        res.render('../views/500', { msg: 'User not found' });
      }
    }
  }
}

module.exports = Cash_out;