class Bank {
  static get_bank_name(bcode) {
    const bname = {
      BB1: "BRAC Bank",
      SB1: "SIBL",
      PB1: "Prime Bank",
      AB1: "Arafah Bank",
      DB1: "DBBL"
    };
    return bname[bcode];
  }

  static get_bill_type(btype) {
    const bill_type = {
      EB: "Electricity",
      WB: "Water",
      GB: "Gas"
    };

    return bill_type[btype];
  }
}

module.exports = Bank;