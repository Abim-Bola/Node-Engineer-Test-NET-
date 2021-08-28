import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import {
  createdResponse,
  conflictResponse,
  // successfulResponse,
  // unauthorizedResponse,
} from 'App/Helpers/Responses';
import { PaystackService } from 'App/Helpers/Paystack';
import Beneficiary from 'App/Models/Beneficiary';
import TransferToUser from 'App/Validators/TransferToUser';
import { walletTransaction} from 'App/Helpers/Type';
import Wallet from 'App/Models/Wallet';
import AddBeneficiaryValidator from 'App/Validators/AddBeneficiaryValidator';

export default class BenefiariesController {
  public async addBeneficiary({ response, request }: HttpContextContract) {
    try {
        //verify account
      const payload = await request.validate(AddBeneficiaryValidator);
      const { account_number, bank_code } = payload;
      const verifyAccount = await PaystackService.verifyAccountNumber({
        account_number,
        bank_code,
      });
      if (verifyAccount && Object.keys(verifyAccount).length <= 0) {
        throw Error('Invalid account information');
      }
      //check if already added to beneficiaries
      const findBeneficiary = await Beneficiary.query().where('account_number', account_number);

      if(findBeneficiary.length > 0){
        return conflictResponse({
          response,
          message: 'Beneficiary already exists',
        })
      }
      const beneficiary = new Beneficiary();
      beneficiary.account_number = account_number;
      beneficiary.account_name = verifyAccount.account_name;
      beneficiary.bank_code = bank_code;
      beneficiary.user_id = 1;

    
      await beneficiary.save();
      return createdResponse({
        response,
        message:
          'Beneficiary Added',
      })
    } catch (error) {
      return error;
    }
  }

    public async sendToBeneficiary({ response, request }: HttpContextContract) {
      try {
          //verify account
        const payload = await request.validate(TransferToUser);
        const { account_number, bank_code, email, amount, reason, type } = payload;
        const verifyAccount = await PaystackService.verifyAccountNumber({
          account_number,
          bank_code,
        });
        if (verifyAccount && Object.keys(verifyAccount).length <= 0) {
          throw Error('Invalid account information');
        }
        //check if beneficiary exists
        const findBeneficiary = await Beneficiary.query().where('account_number', account_number);
  
        if(!findBeneficiary.length){
          return conflictResponse({
            response,
            message: 'Beneficiary not found',
          })
        }
        const wallet = await Wallet.query().where('user', user.id ).first();

        if (wallet.balance < amount) {
          throw new Error('Insufficient funds');
        }
        // create transfer recipient
        const transferRecipient = await PaystackService.createTransferRecipient({
          account_number,
          bank_code
        });
        console.log({ transferRecipient });
        // 3) Inititate transfer
        const transfer = await PaystackService.transfer({
          reason,
          amount,
          recipient: transferRecipient,
        });
        const final = await walletTransaction[type]({ amount, walletId: wallet.id });
        return createdResponse({
          response,
          message:
            'Transfer Successful',
        })
      } catch (error) {
        return error;
      }

  }
}
