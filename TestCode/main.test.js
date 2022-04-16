const UserModelTest        = require('./modelsTest/user_model_test');
const TransactionModelTest = require('./modelsTest/transaction_model_test');
const HistoryModelTest     = require('./modelsTest/history_model_test');
const BillPaymentModelTest = require('./modelsTest/bill_payment_model_test');

const CashOutTest          = require('./controllersTest/Cash_out_test');
const HistoryTest          = require('./controllersTest/History_test');
const PaybillTest          = require('./controllersTest/Bill_payment_test');
const SendMoneyTest        = require('./controllersTest/Send_money_test');
const TransactionTest      = require('./controllersTest/Transaction_test');
const UserTest             = require('./controllersTest/User_test');

const { connect, clearDatabase, closeDatabase } = require('./dbmock');

describe('Unit Test', () => {
  beforeAll(async () => {
    await connect();
  });
  
  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });
  
  describe('Model Test', () => {
    describe('User Model Test', () => {
      UserModelTest.test_add_new_user();
      UserModelTest.test_verify_user();
      UserModelTest.test_find_user();
      UserModelTest.test_modify_balance();
    });
  
    describe('Transaction Model Test', () => {
      TransactionModelTest.test_save_transaction();
      TransactionModelTest.test_retrieve_history();
    });
  
    describe('History Model Test', () => {
      HistoryModelTest.test_save_history();
      HistoryModelTest.test_retrieve_history();
    });
  
    describe('Bill Payment Model Test', () => {
      BillPaymentModelTest.test_save_bill();
      BillPaymentModelTest.test_bill_history();
    });
  });
    

  describe('Controller Test', () => {
    describe('Bill Payment Class Test', () => {
      PaybillTest.test_paybill_action();
      PaybillTest.test_bill_history_action();
    });

    describe('Cash Out Class Test', () => {
      CashOutTest.test_cash_out();
    });

    describe('History Class Test', () => {
      HistoryTest.test_history_action();
    });

    describe('Send Money Class Test', () => {
      SendMoneyTest.test_send_money();
    });

    describe('Transaction Class Test', () => {
      TransactionTest.test_do_transaction();
    });

    describe('User Class Test', () => {
      UserTest.test_login_get();
      UserTest.test_login_post();
      UserTest.test_logout();
      UserTest.test_signup_get();
      UserTest.test_signup_post();
      UserTest.test_dashboard();
    });
  });
});
