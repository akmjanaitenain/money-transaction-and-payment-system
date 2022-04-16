const SendMoney = require('../../controllers/Send_money');
const Transaction = require('../../controllers/Transaction');
const { UserModel } = require('../../models/user_model');
const { HistoryModel } = require('../../models/history_model');
const { TransactionModel } = require('../../models/transaction_model');
const { Request, Response } = require('../testutils');

class SendMoneyTest {
  static test_send_money() {
    describe('Send Money', () => {
      test('should render dashboard', async () => {
        const req = new Request({ key: "snd@gmail.com", role: false });
        const res = new Response();
        req.setBody({
          amount: "200",
          receiver_email: "rsv@gmail.com"
        });
        const user1 = new UserModel({ email: "snd@gmail.com", balance: 2000 });
        const user2 = new UserModel({ email: "rsv@gmail.com", balance: 500 });
        await user1.save();
        await user2.save();        
        await Transaction.do_transaction("200", "snd@gmail.com", "rsv@gmail.com", "gen");
        await SendMoney.send_money(req, res);
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
          receiver_email: "rec@gmail.com"
        });
        const user = new UserModel({ email: "rec@gmail.com", balance: 500 });
        await user.save();
        await Transaction.do_transaction("200", "snd@gmail.com", "rec@gmail.com", "gen");
        await SendMoney.send_money(req, res);
        await UserModel.deleteOne({ _id: user._id });
        await TransactionModel.deleteMany({});
        expect(res.getRendered().path).toMatch('500');
      });
      test('if not logged in, should render login page', async () => {
        const req = new Request();
        const res = new Response();
        await SendMoney.send_money(req, res);
        expect(res.getRedirected()).toMatch('login');
      });
    });
  }
}

module.exports = SendMoneyTest;