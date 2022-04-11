class Cash_in {
  constructor(agent_email, date, amount){
    this.email = agent_email;
    this.date = date;
    this.amount = amount;
    this.type = "CASHIN";
  }
}

module.exports = Cash_in;