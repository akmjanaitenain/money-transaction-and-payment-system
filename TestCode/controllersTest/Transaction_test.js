const Transaction = require('../../controllers/Transaction');
const { UserModel } = require('../../models/user_model');
const { HistoryModel } = require('../../models/history_model');
const { TransactionModel } = require('../../models/transaction_model');

class TransactionTest {
  static test_do_transaction() {
    describe('Do Transaction', () => {
      test('should show "You can\'t send money to yourself!"', async (done) => {
        const result = await Transaction.do_transaction(200, "abc@gmail.com", "abc@gmail.com", "gen");
        await TransactionModel.deleteMany({});
        expect(result.OK).toBe(false);
        done();
      });
      test('User found', async (done) => {
        const user1 = new UserModel({ email: "pqrs@gmail.com", balance: 1000 });
        const user2 = new UserModel({ email: "abc@gmail.com", balance: 1000 });
        await user1.save();
        await user2.save();
        const result = await Transaction.do_transaction(200, "pqrs@gmail.com", "abc@gmail.com", "gen");
        await UserModel.deleteMany({ _id: user1._id });
        await UserModel.deleteMany({ _id: user2._id });
        await TransactionModel.deleteOne({ sender_email: user1.email });
        await HistoryModel.deleteOne({ user: user1.email })
        expect(result.OK).toBe(true);
        done();
      });
      test('User not found', async (done) => {
        const result = await Transaction.do_transaction(200, "xyz@gmail.com", "abc@gmail.com", "gen");
        await TransactionModel.deleteMany({});
        expect(result.OK).toBe(false);
        done();
      });
      test('should show "Not enough balance"', async (done) => {
        const user = new UserModel({ email: "ppp@gmail.com", balance: 450 });
        await user.save();
        const result = await Transaction.do_transaction(700, "ppp@gmail.com", "abc@gmail.com", "gen");
        await UserModel.deleteOne({ _id: user._id });
        await TransactionModel.deleteMany({});
        expect(result.OK).toBe(false);
        done();
      });
      test('should show "User not found"', async (done) => {
        const user = new UserModel({ email: "agent@gmail.com", is_agent: true });
        await user.save();
        const result = await Transaction.do_transaction(50, "uuu@gmail.com", "age@gmail.com", "csh");
        await UserModel.deleteOne({ _id: user._id });
        await TransactionModel.deleteMany({});
        expect(result.OK).toBe(false);
        done();
      });
      test('should show "The email does not belong to an agent"', async (done) => {
        const user = new UserModel({ email: "agent@gmail.com", is_agent: false });
        await user.save();
        const result = await Transaction.do_transaction(50, "usus@gmail.com", "agent@gmail.com", "csh");
        await UserModel.deleteOne({ _id: user._id });
        await TransactionModel.deleteMany({});
        expect(result.OK).toBe(false);
        done();
      });
      test('when saving transaction in database fails', async (done) => {
        const result = await Transaction.do_transaction(50, "save@gmail.com", "agent@gmail.com", "csh");
        await TransactionModel.deleteMany({});
        expect(result.OK).toBe(false);
        done();
      });
      test('when decreasing sender\'s balance fails', async (done) => {
        const user = new UserModel({ email: "ebd@gmail.com", balance: 500 });
        await user.save();
        const result = await Transaction.do_transaction(50, "ebd@gmail.com", "ebec@gmail.com", "gen");
        await UserModel.deleteOne({ _id: user._id });
        await TransactionModel.deleteMany({});
        await HistoryModel.deleteMany({});
        expect(result.OK).toBe(false);
        done();
      });
      test('when increasing receiver\'s balance fails', async (done) => {
        const user = new UserModel({ email: "ebe@gmail.com", balance: 500 });
        await user.save();
        const result = await Transaction.do_transaction(50, "eee@gmail.com", "ebeb@gmail.com", "gen");
        await UserModel.deleteOne({ _id: user._id });
        await TransactionModel.deleteMany({});
        await HistoryModel.deleteMany({});
        expect(result.OK).toBe(false);
        done();
      });
      test('Save transaction history', async (done) => {
        const result = await Transaction.do_transaction(50, "aaa@gmail.com", "bbb@gmail.com", "gen");
        await TransactionModel.deleteMany({});
        await HistoryModel.deleteMany({});
        done();
      });
    });
  }
}

module.exports = TransactionTest;