const { UserOp } = require("../models/user_model");
const { sessExist } = require("../utils/common");

class User {
  constructor(){
    this.first_name = "";
    this.last_name = "";
    this.phone_no = "";
    this.email = "";
    this.password = "";
    this.nID = "";
    this.user_ID = "";
    this.username = "";
    this.balance = 0;
  }

  static async login(email, password){
    const attempt = await UserOp.verify_user(email, password);
    if(attempt.OK){
      let temp = attempt.is_agent ? new Agent() : new General();
      temp.first_name = attempt.user.first_name;
      temp.last_name = attempt.user.last_name;
      temp.email = attempt.user.email;
      temp.username = attempt.user.username;
      return { OK: true, user: temp };
    } else {
      return attempt;
    }
  }

  static async login_get(req, res) {
    res.render('login', { title: 'Login', msg: null });
  };

  static async login_post(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const attempt = await User.login(email, password);
    if(attempt.OK){
      req.session.user = { key: attempt.user.email, role: attempt.user.is_agent ? "agent" : "general" };
      res.redirect('/dashboard');
    } else {
      res.render('login', { title: 'Login', msg: 'Incorrect email or password' });
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }
  
  static async signup(first_name, last_name, phone_no, email, password, nID, username, balance, is_agent){
    const attempt = await UserOp.add_new_user(first_name, last_name, phone_no, email, password, nID, username, balance, is_agent);
    return true;
  }
  
  static async signup_get(req, res) {
    res.render('signup', { title: 'Signup' });
  };
  
  static async signup_post(req, res) {
    // console.log(req.body);
    const { first_name, last_name, phone_no, email, password, nID, username } = req.body;
    const is_agent = req.body.is_agent === 'on';
    await User.signup(first_name, last_name, phone_no, email, password, nID, username, is_agent ? 5000 : 100, is_agent);
    res.redirect('/login');
  }

  static async dashboard(req, res) {
    if (!sessExist(req)) {
      res.redirect('/login');
    } else {
      let { key, role } = req.session.user;
      const user = await UserOp.find_user(key);
      if (user.OK) {
        res.render('../views/dashboard', { user: user.user, msg: null, title: 'Dashboard' });
      } else {
        res.render('../views/500', { msg: 'User not found' });
      }
    }
  }
}

class Agent extends User{
  constructor(){
    super();
    this.is_agent = true;
  }
}

class General extends User{
  constructor(){
    super();
    this.is_agent = false;
  }
}

module.exports = User;