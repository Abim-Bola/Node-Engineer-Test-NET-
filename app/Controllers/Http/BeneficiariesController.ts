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
import User from 'App/Models/User';
import AddBeneficiaryValidator from 'App/Validators/AddBeneficiaryValidator';

export default class BenefiariesController {
  public async addBeneficiary({ response, request }: HttpContextContract) {
    try {
      const {id} = request.body().user[0];
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
      const findBeneficiary = await Beneficiary.query().where('account_number', account_number).first();

      if(findBeneficiary){
        return conflictResponse({
          response,
          message: 'Beneficiary already exists',
        })
      }
      const beneficiary = new Beneficiary();
      beneficiary.account_number = account_number;
      beneficiary.account_name = verifyAccount.account_name;
      beneficiary.bank_code = bank_code;
      beneficiary.user_id = id;

    
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
        const {id} = request.body().user[0];
          //verify account
        const payload = await request.validate(TransferToUser);
        const { account_number, bank_code, amount, reason, type } = payload;
        const verifyAccount = await PaystackService.verifyAccountNumber({
          account_number,
          bank_code,
        });
        if (verifyAccount && Object.keys(verifyAccount).length <= 0) {
          return('Invalid account information');
        }
         
        const wallet = await Wallet.query().where('user', id );
        const serializeWallet = wallet.map((w) => w.serialize())

        //check if beneficiary exists
        const findBeneficiary = await Beneficiary.query().where('account_number', account_number).where('user_id',id).first();
  
        if(!findBeneficiary){
          return conflictResponse({
            response,
            message: 'Beneficiary not found',
          })
        }
        if (serializeWallet[0].balance < amount) {
          return('Insufficient funds');
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
