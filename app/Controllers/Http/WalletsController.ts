import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import {
  createdResponse,
  conflictResponse,
  // successfulResponse,
  // unauthorizedResponse,
} from 'App/Helpers/Responses';

import { PaystackService } from 'App/Helpers/Paystack';
import { walletTransaction } from 'App/Helpers/Type';
import AddAccountValidator from 'App/Validators/AddAccountValidator';
import TransferToUser from 'App/Validators/TransferToUser';
import Wallet from 'App/Models/Wallet';
import User from 'App/Models/User';

export default class WalletsController {
  public async addAccount({ response, request }: HttpContextContract) {
    try {
      const payload = await request.validate(AddAccountValidator);
      const { account_number, bank_code } = payload;
      const verifyAccount = await PaystackService.verifyAccountNumber({
        account_number,
        bank_code,
      });
      if (verifyAccount && Object.keys(verifyAccount).length <= 0) {
        throw Error('Invalid account information');
      }
      //check if beneficiary exists
      const findWallet = await Wallet.query().where('account_number', account_number).first();

      if (findWallet) {
        return conflictResponse({
          response,
          message: 'Wallet with account number already exists',
        })
      }
      const wallet = new Wallet();
      wallet.account_number = verifyAccount.account_number,
        wallet.account_name = verifyAccount.account_name,
        wallet.bank_code = bank_code,
        wallet.user = "1"
      await wallet.save();
      return createdResponse({
        response,
        message: 'Wallet Created',
      });
    } catch (error) {
      return error;
    }
  }

  public async transfer({ response, request }: HttpContextContract) {
    try {
      const {id} = request.body().user[0];
      const payload = await request.validate(TransferToUser);
      const { account_number, bank_code, amount, reason, type } = payload;
      // 1) Verify account number
    
      const wallet = await Wallet.query().where('user', id);
      const serializeWallet = wallet.map((w) => w.serialize())
      const verifyAccount = await PaystackService.verifyAccountNumber({
        account_number,
        bank_code,
      });

      if (verifyAccount && Object.keys(verifyAccount).length <= 0) {
        throw Error('Invalid account information');
      }
      if(serializeWallet[0].balance < amount) {
        console.log('Insufficient funds');
      }
      // create transfer recipient
      const transferRecipient = await PaystackService.createTransferRecipient({
        account_number,
        bank_code
      });
     
      // 3) Inititate transfer
      const transfer = await PaystackService.transfer({
        reason,
        amount,
        recipient: transferRecipient,
      });
      const final = await walletTransaction[type]({ amount, walletId: serializeWallet[0].id });
      return `You have just made a ${type} transaction of ${amount} Naira to ${verifyAccount.account_name}`;
    } catch (error) {
      return error;
    }
  }
}
