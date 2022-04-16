const mongoose = require('mongoose');
const { PaybillModel, PaybillOp } = require('../../models/bill_payment_model');

class PaybillModelTest {
  static test_save_bill() {
    describe('Save Bill', () => {
      test('Bill payment successfull', async () => {
        const result = await PaybillOp.save_bill(
          "a.k.m.janaite.nain@g.bracu.ac.bd",
          "DB1",
          "GB",
          "450"
        );
        expect(result.OK).toBe(true);
        await PaybillModel.deleteOne({ _id: result.payment._id });
      });
    });
  }

  static test_bill_history() {
    describe('View Bill History', () => {
      test('Bill history found', async () => {
        const paybill = new PaybillModel({ email: "a.k.m.janaite.nain@g.bracu.ac.bd" });
        await paybill.save();
        const result = await PaybillOp.bill_history("a.k.m.janaite.nain@g.bracu.ac.bd");
        expect(result.OK).toBe(true);
        await PaybillModel.deleteOne({ _id: paybill._id });
      });
      test('Bill history not found', async () => {
        const paybill = new PaybillModel({ email: "dasani@wasa.gov.bd" });
        await paybill.save();
        const result = await PaybillOp.bill_history("dasani.water.bottle@wasa.gov.bd");
        expect(result.OK).toBe(false);
        await PaybillModel.deleteOne({ _id: paybill._id });
      });
      
    });
  }
}

module.exports = PaybillModelTest;