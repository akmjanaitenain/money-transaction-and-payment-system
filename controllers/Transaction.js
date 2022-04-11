const { TransactionOp } = require("../models/transaction_model");
const { UserOp } = require("../models/user_model");
const { HistoryOp } = require("../models/history_model");


class Transaction {
  static async do_transaction(amount, sender_email, receiver_email, transaction_type) {
    if (sender_email === receiver_email) {
      return { OK: false, msg: 'You can\'t send money to yourself!' };
    }
    
    const user = await UserOp.find_user(sender_email);
    if (!user.OK) {
      return user;
    }

    if (user.user.balance < amount) {
      return { OK: false, msg: 'Not enough balance' };
    }

    if (transaction_type === 'csh') {
      const agent = await UserOp.find_user(receiver_email);
      if (!agent.OK) {
        return agent;
      }
      if (!agent.user.is_agent) {
        return { OK: false, msg: 'The email does not belong to an agent' };
      }
    }

    const attempt = await TransactionOp.save_transaction(amount, sender_email, receiver_email, transaction_type);
    if (!attempt.OK) {
      return attempt;
    }

    const sender = await UserOp.modify_balance(sender_email, -amount);
    if (!sender.OK) {
      return sender;
    }
    
    const receiver = await UserOp.modify_balance(receiver_email, amount);
    if (!receiver.OK) {
      return receiver;
    }
    
    const history = await HistoryOp.save_history(attempt.transaction._id, sender_email);
    if (!history.OK) {
      return history;
    }

    return { OK: true, msg: "Transaction successful", transaction: attempt };
  }
}

module.exports = Transaction;