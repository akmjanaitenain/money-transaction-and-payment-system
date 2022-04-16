const mongoose = require('mongoose');
const { HistoryModel, HistoryOp } = require('../../models/history_model');

class HistoryModelTest {
  static test_save_history() {
    describe('Save History', () => {
      test('History saved successfully', async () => {
        const result = await HistoryOp.save_history(
          "606caeefa5888732b8d8b9ba",
          "a.k.m.janaite.nain@g.bracu.ac.bd"
        );
        expect(result.OK).toBe(true);
        await HistoryModel.deleteOne({ _id: result.history._id });
      });
    });
  }

  static test_retrieve_history() {
    describe('Retrieve All History', () => {
      test('History was found', async () => {
        const history = new HistoryModel({ user: "a.k.m.janaite.nain@g.bracu.ac.bd" });
        await history.save();
        const result = await HistoryOp.retrieve_history("a.k.m.janaite.nain@g.bracu.ac.bd");
        expect(result.OK).toBe(true);
        await HistoryModel.deleteOne({ _id: history._id })
      });
      test('History was not found', async () => {
        const history = new HistoryModel({ user: "dasani@wasa.gov.bd" });
        await history.save();
        const result = await HistoryOp.retrieve_history("dasani.bottle@wasa.gov.bd");
        expect(result.OK).toBe(false);
        await HistoryModel.deleteOne({ _id: history._id })
      });
    });
  }
}

module.exports = HistoryModelTest;