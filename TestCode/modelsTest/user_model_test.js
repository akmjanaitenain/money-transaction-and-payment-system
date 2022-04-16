const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { UserModel, UserOp } = require('../../models/user_model');

class UserModelTest {
  static test_add_new_user() {
    describe('Add New User', () => {
      test('New user can be created', async () => {
        const result = await UserOp.add_new_user(
          "nain",
          "nain",
          "01700123456",
          "nain@yahoo.com",
          "abc123",
          "9517538264",
          "resai",
          "100",
          false
        );
        expect(result._id).toBeTruthy();
        await UserModel.deleteOne({ _id: result._id });
      });
    });
  }

  static test_verify_user() {
    describe('Verify User', () => {
      test('When email and pasword both are correct', async () => {
        const user = new UserModel({ email: "a.k.m.janaite.nain@g.bracu.ac.bd", password: bcrypt.hashSync("1234", 10) });
        await user.save();
        const result = await UserOp.verify_user("a.k.m.janaite.nain@g.bracu.ac.bd", "1234");
        expect(result.OK).toBe(true);
        await UserModel.deleteOne({ _id: user._id });
      });
      test('When email is correct but password is incorrect', async () => {
        const user = new UserModel({ email: "a.k.m.janaite.nain@g.bracu.ac.bd", password: bcrypt.hashSync("1234", 10) });
        await user.save();
        const result = await UserOp.verify_user("a.k.m.janaite.nain@g.bracu.ac.bd", "4321");
        expect(result.OK).toBe(false);
        await UserModel.deleteOne({ _id: user._id });
      });
      test('When email is incorrect', async () => {
        const user = new UserModel({ email: "a.k.m.janaite.nain@g.bracu.ac.bd", password: bcrypt.hashSync("1234", 10) });
        await user.save();
        const result = await UserOp.verify_user("nain@yahoo.com", "1234");
        expect(result.OK).toBe(false);
        await UserModel.deleteOne({ _id: user._id });
      });
    });
  }

  static test_find_user() {
    describe('Find User', () => {
      test('User was found', async () => {
        const user = new UserModel({ email: "a.k.m.janaite.nain@g.bracu.ac.bd", password: bcrypt.hashSync("1234", 10) });
        await user.save();
        const result = await UserOp.find_user("a.k.m.janaite.nain@g.bracu.ac.bd");
        expect(result.OK).toBe(true);
        await UserModel.deleteOne({ _id: user._id });
      });
      test('User was not found', async () => {
        const user = new UserModel({ email: "a.k.m.janaite.nain@g.bracu.ac.bd", password: bcrypt.hashSync("1234", 10) });
        await user.save();
        const result = await UserOp.find_user("nain@yahoo.com");
        expect(result.OK).toBe(false);
        await UserModel.deleteOne({ _id: user._id });
      });
    });
  }

  static test_modify_balance() {
    describe('Modify Balance', () => {
      test('Balance modified', async () => {
        const user = new UserModel({ email: "a.k.m.janaite.nain@g.bracu.ac.bd", password: bcrypt.hashSync("1234", 10) });
        await user.save();
        const result = await UserOp.find_user("a.k.m.janaite.nain@g.bracu.ac.bd");
        expect(result.OK).toBe(true);
        await UserModel.deleteOne({ _id: user._id });
      });
      test('User was not found, can\'t modify balance', async () => {
        const user = new UserModel({ email: "a.k.m.janaite.nain@g.bracu.ac.bd", password: bcrypt.hashSync("1234", 10) });
        await user.save();
        const result = await UserOp.find_user("nain@yahoo.com");
        expect(result.OK).toBe(false);
        await UserModel.deleteOne({ _id: user._id });
      });
    });
  }
}

module.exports = UserModelTest;