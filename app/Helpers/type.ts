const { PaystackService } = require("./paystack");
const { Type } = require("./transaction");

export const transactionType = {
  credit: PaystackService,
  debit: null,
};

export const walletTransaction = {
  credit: Type.creditWallet,
  debit: Type.debitWallet,
};
