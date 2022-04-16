const CashOut = require('../../controllers/Cash_out');
const Transaction = require('../../controllers/Transaction');
const { UserModel, UserOp } = require('../../models/user_model');
const { HistoryModel, HistoryOp } = require('../../models/history_model');
const { TransactionModel, TransactionOp } = require('../../models/transaction_model');
const { Request, Response } = require('../testutils');

class CashOutTest {
  static test_cash_out() {
    describe('Cash Out', () => {
      test('should render dashboard', async () => {
        const req = new Request({ key: "snd@gmail.com", role: false });
        const res = new Response();
        req.setBody({
          amount: "200",
          agent_email: "agent@gmail.com"
        });
        const user1 = new UserModel({ email: "snd@gmail.com", balance: 2000 });
        const user2 = new UserModel({ email: "agent@gmail.com", balance: 500 });
        await user1.save();
        await user2.save();        
        await Transaction.do_transaction("200", "snd@gmail.com", "agent@gmail.com", "csh");
        await CashOut.cash_out(req, res);
        await UserModel.deleteOne({ _id: user1._id });
        await UserModel.deleteOne({ _id: user2._id });
        await HistoryModel.deleteMany({ user: user1.email });
        await TransactionModel. deleteOne({ sender_email: user1.email });
        expect(res.getRendered().path).toMatch('dashboard');
      });
      test('if user not found, should render 500 page', async () => {
        const req = new Request({ key: "snd@gmail.com", role: false });
        const res = new Response();
        req.setBody({
          amount: "200",
          agent_email: "agt@gmail.com"
        });
        const user = new UserModel({ email: "agt@gmail.com", balance: 500 });
        await user.save();
        await Transaction.do_transaction("200", "snd@gmail.com", "agt@gmail.com", "gen");
        await CashOut.cash_out(req, res);
        await UserModel.deleteOne({ _id: user._id });
        await TransactionModel.deleteMany({});
        expect(res.getRendered().path).toMatch('500');
      });
      test('if not logged in, should render login page', async () => {
        const req = new Request();
        const res = new Response();
        await CashOut.cash_out(req, res);
        expect(res.getRedirected()).toMatch('login');
      });
    });
  }
}

module.exports = CashOutTest;