const mongoose = require('mongoose');
const { TransactionModel, TransactionOp } = require('../../models/transaction_model');
const { UserModel } = require('../../models/user_model');

class TransactionModelTest {
  static test_save_transaction() {
    describe('Save Transaction', () => {
      test('Transaction saved successfully', async () => {
        const result = await TransactionOp.save_transaction(
          "200",
          "a.k.m.janaite.nain@g.bracu.ac.bd",
          "fname.lname@gmail.com",
          "csh"
        );
        expect(result.OK).toBe(true);
        await TransactionModel.deleteOne({ _id: result.transaction._id });
      });
    });
  }
  
  static test_retrieve_history() {
    describe('Retrieve Transaction History', () => {
      test('Transaction history was found', async () => {
        const transaction = new TransactionModel({ sender_email: "a.k.m.janaite.nain@g.bracu.ac.bd", receiver_email: "dasani@wasa.gov.bd" });
        await transaction.save();
        const result = await TransactionOp.retrieve_history("a.k.m.janaite.nain@g.bracu.ac.bd");
        expect(result.OK).toBe(true);
        await TransactionModel.deleteOne({ _id: transaction._id })
      });
      test('Transaction history was not found', async () => {
        const transaction = new TransactionModel({ sender_email: "a.k.m.janaite.nain@g.bracu.ac.bd", receiver_email: "dasani@wasa.gov.bd" });
        await transaction.save();
        const result = await TransactionOp.retrieve_history("dasani.water.bottle@wasa.gov.bd");
        expect(result.OK).toBe(false);
        await TransactionModel.deleteOne({ _id: transaction._id })
      });
    });
  }
}

module.exports = TransactionModelTest;