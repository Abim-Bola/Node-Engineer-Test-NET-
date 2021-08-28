import  { PaystackService } from "./paystack";
import { creditWallet, debitWallet } from "./transactions";

module.exports.transactionType = {
  credit: PaystackService,
  debit: null,
};

module.exports.walletTransaction = {
  credit: creditWallet,
  debit: debitWallet,
};
