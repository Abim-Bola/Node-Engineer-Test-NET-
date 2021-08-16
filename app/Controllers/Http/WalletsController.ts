import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import {
  createdResponse,
  conflictResponse,
  // successfulResponse,
  // unauthorizedResponse,
} from 'App/Helpers/Responses';

import { PaystackService } from 'App/Helpers/Paystack';
import AddAccountValidator from 'App/Validators/AddAccountValidator';
import Wallet from 'App/Models/Wallet';

export default class WalletsController {
  public async addAccount({ response, request }: HttpContextContract) {
    try {
      console.log("request",request.body())
      const payload = await request.validate(AddAccountValidator);
      const { account_number, bank_code } = payload;
      const verifyAccount = await PaystackService.verifyAccountNumber({
        account_number, 
        bank_code,
      });
      if (verifyAccount && Object.keys(verifyAccount).length <= 0) {
        throw Error('Invalid account information');
      }

      const wallet = new Wallet();
      wallet.account_number = verifyAccount.account_number,
      wallet.account_name = verifyAccount.account_name
      wallet.bank_code = bank_code
    } catch (error) {
      return error;
    }
  }

  // public async transfer({ response, request }: HttpContextContract) {
  //   try {
  //     const { accountNumber, bankCode, email, amount, reason, type } = payload;
  //     // 1) Verify account number
  //     const user = await User.findOne({ email });
  //     const wallet = await Wallet.findOne({ user: user._id });
  //     const verifyAccount = await PaystackService.verifyAccountNumber({
  //       account_number,
  //       bank_code,
  //     });
  //     console.log(verifyAccount);
  //     if (verifyAccount && Object.keys(verifyAccount).length <= 0) {
  //       throw Error('Invalid account information');
  //     }
  //     if (wallet.balance < amount) {
  //       throw new Error('Insufficient funds');
  //     }
  //     // create transfer recipient
  //     const transferRecipient = await PaystackService.createTransferRecipient({
  //       account_number: accountNumber,
  //       bank_code: bankCode,
  //     });
  //     console.log({ transferRecipient });
  //     // 3) Inititate transfer
  //     const transfer = await PaystackService.transfer({
  //       reason,
  //       amount,
  //       recipient: transferRecipient,
  //     });
  //     const final = await walletTransaction[type]({ amount, walletId: wallet.id });
  //   } catch (error) {
  //     return error;
  //   }
  // }
}
