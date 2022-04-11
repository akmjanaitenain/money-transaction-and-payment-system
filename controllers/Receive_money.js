class Receive_money {
  constructor(user_email, date, amount){
    this.email = user_email;
    this.date = date;
    this.amount = amount;
    this.type = "RECEIVE";
  }
}

module.exports = Receive_money;