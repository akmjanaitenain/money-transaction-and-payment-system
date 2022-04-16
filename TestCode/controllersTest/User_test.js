const bcrypt = require('bcrypt');
const User = require('../../controllers/User');
const { UserModel } = require('../../models/user_model');
const { Request, Response } = require('../testutils');

class UserTest {
  static test_login_get() {
    describe('GET /login', () => {
      test('Should render login page', async () => {
        const req = new Request();
        const res = new Response();
        await User.login_get(req, res);
        expect(res.getRendered().path).toMatch('login');
      });
    });
  }

  static test_login_post() {
    describe('POST /login', () => {
      test('Should post to /login', async () => {
        const req = new Request();
        const res = new Response();
        req.setBody({
          email: "abc@gmail.com",
          password: "1234"
        });
        const user = new UserModel({ email: "abc@gmail.com", password: bcrypt.hashSync("1234", 10) });
        await user.save();
        await User.login_post(req, res);
        await UserModel.deleteOne({ _id: user._id });
        expect(req.session.user.key).toBeTruthy();
      });
      test('should show \"Incorrect email or password\"', async () => {
        const req = new Request();
        const res = new Response();
        req.setBody({
          email: "abd@gmail.com",
          password: "4321"
        });
        const user = new UserModel({ email: "abd@gmail.com", password: bcrypt.hashSync("1234", 10) });
        await user.save();
        await User.login_post(req, res);
        await UserModel.deleteOne({ _id: user._id });
        expect(req.session.user.key).toBeFalsy();
      });
    });
  }

  static test_logout() {
    describe('GET /logout', () => {
      test('should logout', async () => {
        const req = new Request();
        const res = new Response();
        await User.logout(req, res);
        expect(req.session.user.key).toBeFalsy();
      });
    });
  }

  static test_signup_get() {
    describe('GET /signup', () => {
      test('should render signup page', async () => {
        const req = new Request();
        const res = new Response();
        await User.signup_get(req, res);
        expect(res.getRendered().path).toMatch('signup');
      });
    });
  }
  
  static test_signup_post() {
    describe('POST /signup', () => {
      test('should post to /signup', async () => {
        const req = new Request();
        const res = new Response();
        req.setBody({
          first_name : "fname", 
          last_name  : "lname",
          phone_no   : "01700112233",
          email      : "fname.lname@gmail.com",
          password   : "abc123",
          nID        : "987456123",
          username   : "uname",
          balance    : "100",
          is_agent   : false
        });
        await User.signup_post(req, res);
        const query = await UserModel.find({ email: "fname.lname@gmail.com" }).exec();
        await UserModel.deleteOne({ email: "fname.lname@gmail.com" });
        expect(query.length).toBe(1);
      });
    });
  }
  
  static test_dashboard() {
    describe('GET /dashboard', () => {
      test('if logged in, should render dashboard page', async () => {
        const req = new Request({ key: "abc@gmail.com", role: false});
        const res = new Response();
        const user = new UserModel({ email: "abc@gmail.com" });
        await user.save();
        await User.dashboard(req, res);
        await UserModel.deleteOne({ _id: user._id });
        expect(res.getRendered().path).toMatch('dashboard');
      });
      test('if user not found, should render 500 page', async () => {
        const req = new Request({ key: "xyz@gmail.com", role: false });
        const res = new Response();
        await User.dashboard(req, res);
        expect(res.getRendered().path).toMatch('500');
      });
      test('if not logged in, should render login page', async () => {
        const req = new Request();
        const res = new Response();
        await User.logout(req, res);
        expect(res.getRedirected()).toMatch('login');
      });
    });
  }
}

module.exports = UserTest;