import Transaction  from 'App/Models/Transaction';
 import Wallet from 'App/Models/Wallet';;
import { v4: uuidv4 } from "uuid";

/**
 *
 * @param {string} walletId Wallet id
 * @param {string} amount Amount
 */
export const  creditWallet = async ({ ...params }) => {
  const { walletId, amount } = params;
  const wallet = await Wallet.query().where('id' , walletId);
  console.log(wallet)
  const serializeWallet = wallet.map((w) => w.serialize())
  const balanceAfter = parseInt(serializeWallet.balance + amount);
  const transaction = await Transaction.create({
    reference: v4(),
    balanceBefore: serializeWallet.balance,
    balanceAfter,
    direction: "credit",
    wallet: serializeWallet.id,
  });
  wallet.balance = balanceAfter;
  await wallet.save();
  return transaction;
}

/**
 * @description A function that handles debit
 * @param {string} walletId Wallet id
 * @param {string} amount Amount
 */
 export const debitWallet = async({ ...params }) =>{
  const { walletId, amount } = params;
  const wallet = await Wallet.findById(walletId);
  const balanceAfter = parseInt(wallet.balance - amount);
  const transaction = await Transaction.create({
    reference: uuidv4(),
    balanceBefore: wallet.balance,
    balanceAfter,
    direction: "debit",
    wallet: wallet._id,
  });
  wallet.balance = balanceAfter;
  await wallet.save();
  return transaction;
}

