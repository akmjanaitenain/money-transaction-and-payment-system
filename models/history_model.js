const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const historySchema = new mongoose.Schema({
  date_time: Date,
  transaction_ID: ObjectID,
  user: String
});

const HistoryModel = mongoose.model('history', historySchema);

class HistoryOp {
  static async save_history(transaction_ID, user){
    const history = new HistoryModel({
      date_time: Date.now(),
      transaction_ID,
      user
    });

    return { OK: true, history: await history.save() };
  }

  static async retrieve_history(user) {
    const query = await HistoryModel.find({ user }).exec();
    if (query.length === 0) {
      return { OK: false, msg: "history not found" };
    } else {
      return { OK: true, msg: "history found", history: query };
    }
  }
}

module.exports = {
  HistoryModel,
  HistoryOp
};