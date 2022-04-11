const { TransactionOp } = require("../models/transaction_model");
const { UserOp } = require("../models/user_model");
const Send_money = require("../controllers/Send_money");
const Receive_money = require("../controllers/Receive_money");
const Cash_in = require("../controllers/Cash_in");
const Cash_out = require("../controllers/Cash_out");
const { sessExist } = require("../utils/common");

class History {
  static async history_action(req, res) {
    if (!sessExist(req)) {
      res.redirect('/login');
    } else {
      let { key, role } = req.session.user;
      const history = await TransactionOp.retrieve_history(key);
      const user = await UserOp.find_user(key);
      if (user.OK) {
        res.render('../views/history', { history: history.history.map(model => map_history(key, model)), msg: null, title: 'History' });
      } else {
        res.render('../views/500', { msg: 'User not found' });
      }
    }
  }
}

const map_history = (key, val) => { //val = transaction model
  if (val.transaction_type === "gen") {
    if (val.sender_email === key) {
      return new Send_money(val.receiver_email, val.date_time, val.amount);
    } else {
      return new Receive_money(val.sender_email, val.date_time, val.amount);
    }
  } else {
    if (val.sender_email === key) {
      return new Cash_out(val.receiver_email, val.date_time, val.amount);
    } else {
      return new Cash_in(val.sender_email, val.date_time, val.amount);
    }
  }
}

module.exports = History;