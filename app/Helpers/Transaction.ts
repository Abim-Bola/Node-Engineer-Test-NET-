const Transaction = require("../models/transaction");
const Wallet = require("../models/wallet");
const { v4: uuidv4 } = require("uuid");

/**
 *
 * @param {string} walletId Wallet id
 * @param {string} amount Amount
 */
export const Type = {
creditWallet: async ({ ...params })  => { 
  const { walletId, amount } = params;
  const wallet = await Wallet.query().where('id', walletId);
  const balanceAfter = parseInt(wallet.balance + amount);
  const transaction = await Transaction.create({
    reference: uuidv4(),
    balanceBefore: wallet.balance,
    balanceAfter,
    direction: "credit",
    wallet: wallet._id,
  });
  wallet.balance = balanceAfter;
  await wallet.save();
  return transaction;
},

/**
 * @description A function that handles debit
 * @param {number} walletId Wallet id
 * @param {number} amount Amount
 */
debitWallet: async ({ ...params }) => {
  const { walletId, amount } = params;
  const wallet = await Wallet.query().where('id', walletId);
  const balanceAfter = parseInt(wallet.balance - amount);
  const transaction = await Transaction.create({
    reference: uuidv4(),
    balanceBefore: wallet.balance,
    balanceAfter,
    direction: "debit",
    wallet: wallet.id,
  });
  wallet.balance = balanceAfter;
  await wallet.save();
  return transaction;
}
}


