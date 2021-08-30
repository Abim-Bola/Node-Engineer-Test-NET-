import Transaction from 'App/Models/Transaction'
import Wallet from 'App/Models/Wallet';
const { v4: uuidv4 } = require("uuid");

/**
 *
 * @param {string} walletId Wallet id
 * @param {string} amount Amount
 */
export const Type = {
creditWallet: async ({ ...params })  => { 
  try {
    const { walletId, amount } = params;
    const wallet = await Wallet.query().where('id', walletId);
    const serializeWallet = wallet.map((w) => w.serialize())
    const balance_after = parseInt(serializeWallet[0].balance + amount);
    const transaction = await Transaction.create({
      reference: uuidv4(),
      balance_before: balance_after,
      balance_after,
      type: "CREDIT",
      wallet_id: serializeWallet[0].id
    });
    serializeWallet[0].balance = balance_after;
    await transaction.save();
    return transaction;
  } catch (error) {
    return error;
  }
},

/**
 * @description A function that handles debit
 * @param {number} walletId Wallet id
 * @param {number} amount Amount
 */
debitWallet: async ({ ...params }) => {
  const { walletId, amount } = params;
  const wallet = await Wallet.query().where('id', walletId);
  const serializeWallet = wallet.map((w) => w.serialize())
  const balance_after = parseInt(serializeWallet[0].balance - amount);
  const transaction = await Transaction.create({
    reference: uuidv4(),
    balance_before: serializeWallet[0].balance,
    balance_after,
    type: "DEBIT",
    wallet_id: serializeWallet[0].id,
  });
  serializeWallet[0].balance = balance_after;
  await transaction.save();
  return transaction;
}
}


