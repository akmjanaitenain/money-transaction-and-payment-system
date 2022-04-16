const History = require('../../controllers/History');
const { HistoryModel } = require('../../models/history_model');
const { TransactionModel, TransactionOp } = require('../../models/transaction_model');
const { UserModel } = require('../../models/user_model');
const { Request, Response } = require('../testutils');

class HistoryTest {
  static test_history_action() {
    describe('History Action', () => {
      test('should render history page', async () => {
        const req = new Request({ key: "sss@gmail.com", role: false });
        const res = new Response();
        const user1 = new UserModel({ email: "sss@gmail.com", balance: 2000 });
        const user2 = new UserModel({ email: "rrr@gmail.com", balance: 1000 });
        await user1.save();
        await user2.save();
        await TransactionOp.save_transaction(200, "sss@gmail.com", "rrr@gmail.com", "gen");
        await History.history_action(req, res);
        await UserModel.deleteOne({ _id: user1._id });
        await UserModel.deleteOne({ _id: user2._id });
        await TransactionModel.deleteOne({ sender_email: user1.email });
        await HistoryModel.deleteOne({ user: user1.email });
        expect(res.getRendered().path).toMatch('history');
      });
      test('should show "User not found"', async () => {
        const req = new Request({ key: "nnn@gmail.com", role: false });
        const res = new Response();
        const user = new UserModel({ email: "rcv@gmail.com", balance: 300 })
        await user.save();
        await TransactionOp.save_transaction(200, "nnn@gmail.com", "rcv@gmail.com", "gen");
        await TransactionModel.deleteMany({});
        await UserModel.deleteOne({ _id: user._id });
        await History.history_action(req, res);
        expect(res.getRendered().path).toMatch('500');
      });
      test('should redirect to login page', async () => {
        const req = new Request();
        const res = new Response();
        await History.history_action(req, res);
        expect(res.getRedirected()).toMatch('login');
      });
    });
  }
}

module.exports = HistoryTest;