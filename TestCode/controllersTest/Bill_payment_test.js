const Bill_payment = require('../../controllers/Bill_payment');
const { PaybillModel } = require('../../models/bill_payment_model');
const { UserModel } = require('../../models/user_model');
const { Request, Response } = require('../testutils');

class PaybillTest {
  static test_paybill_action() {
    describe('Paybill Action', () => {
      test('Payment successful', async () => {
        const req = new Request({ key: "bbb@gmail.com", role: false });
        const res = new Response();
        req.setBody({
          amount: "200",
          bank_code: "DB1",
          bank_type: "WB"
        });
        const user = new UserModel({ email: "bbb@gmail.com", balance: 2000 });
        await user.save();
        await Bill_payment.paybill_action(req, res);
        await UserModel.deleteOne({ email: user.email });
        await PaybillModel.deleteOne({ email: user.email });
        expect(res.getRendered().path).toMatch('dashboard');
      });
      test('if user not found, should render 500 page', async () => {
        const req = new Request({ key: "bxy@gmail.com", role: false });
        const res = new Response();
        req.setBody({
          amount: "200",
          bank_code: "SB1",
          bank_type: "EB"
        });
        await Bill_payment.paybill_action(req, res);
        await PaybillModel.deleteMany({});
        expect(res.getRendered().path).toMatch('500');
      });
      test('if not logged in, should render login page', async () => {
        const req = new Request();
        const res = new Response();
        await Bill_payment.paybill_action(req, res);
        expect(res.getRedirected()).toMatch('login');
      });
    });
  }

  static test_bill_history_action() {
    describe('Bill History Action', () => {
      test('should render bill history', async () => {
        const req = new Request({ key: "aby@gmail.com", role: false });
        const res = new Response();
        const user = new UserModel({ email: "aby@gmail.com", balance: 2000 });
        await user.save();
        await Bill_payment.bill_history_action(req, res);
        await UserModel.deleteOne({ email: user.email });
        await PaybillModel.deleteOne({ email: user.email });
        expect(res.getRendered().path).toMatch('bill_history');
      });
      test('should show "User not found"', async () => {
        const req = new Request({ key: "axy@gmail.com", role: false });
        const res = new Response();
        await Bill_payment.bill_history_action(req, res);
        expect(res.getRendered().path).toMatch('500');
      });
      test('should redirect to login page', async () => {
        const req = new Request();
        const res = new Response();
        await Bill_payment.bill_history_action(req, res);
        expect(res.getRedirected()).toMatch('login');
      });
    });
  }
}

module.exports = PaybillTest;