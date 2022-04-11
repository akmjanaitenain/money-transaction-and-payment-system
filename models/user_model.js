const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  phone_no: String,
  email: String,
  password: String,
  nID: String,
  user_ID: String,
  username: String,
  balance: Number,
  is_agent: Boolean
});

const UserModel = mongoose.model('user', userSchema);

class UserOp {
  static async add_new_user(first_name, last_name, phone_no, email, password, nID, username, balance, is_agent) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ first_name, last_name, phone_no, email, password: hashedPassword, nID, username, balance, is_agent });
    return await user.save();
  }

  static async verify_user(email, password) {
    const query = await UserModel.find({ email }).exec();
    if (query.length === 0) {
      return { OK: false, msg: "email or password is incorrect" };
    } else {
      if (await bcrypt.compare(password, query[0].password)) { //query[0].password === password
        return { OK: true, msg: "Login successful", user: query[0] };
      } else {
        return { OK: false, msg: "email or password is incorrect" };
      }
    }
  }

  static async find_user(email){
    const query = await UserModel.find({ email }).exec();
    if (query.length === 0) {
      return { OK: false, msg: "user not found" };
    } else {
      return { OK: true, msg: "user found", user: query[0] };
    }
  }

  static async modify_balance(email, amount) {
    const query = await UserModel.find({ email }).exec();
    if (query.length === 0) {
      return { OK: false, msg: "user not found" };
    } else {
      query[0].balance += amount;
      return { OK: true, msg: "user found", user: await query[0].save() };
    }
  }
}

module.exports = {
  UserModel,
  UserOp
};