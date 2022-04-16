require('dotenv').config();

const express = require('express');
const session = require('express-session');

const dbConnect = require('./utils/dbConnect');
const User = require("./controllers/User");
const History = require("./controllers/History");
const Bill_History = require("./controllers/Bill_payment");
const Send_money = require("./controllers/Send_money");
const Cash_out = require("./controllers/Cash_out");
const Bill_payment = require("./controllers/Bill_payment");
const { sessExist } = require('./utils/common');

const app = express();

app.use(session({
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { loggedin: sessExist(req), title: 'Homepage' });
});

app.get('/login', User.login_get);
app.get('/signup', User.signup_get);
app.get('/dashboard', User.dashboard);
app.get('/logout', User.logout);
app.get('/history', History.history_action);
app.get('/bill_history', Bill_History.bill_history_action);

app.post('/login', User.login_post);
app.post('/signup', User.signup_post);
app.post('/send_money', Send_money.send_money);
app.post('/cash_out', Cash_out.cash_out);
app.post('/pay_bill', Bill_payment.paybill_action);

app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

//Connect to db and listen to port
dblink = process.env.URI;
dbConnect(dblink).then(() => {
  app.listen(process.env.PORT);
  console.log(`Listening to port http://localhost:${process.env.PORT}`);
});