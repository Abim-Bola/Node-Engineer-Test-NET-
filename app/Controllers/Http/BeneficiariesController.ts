import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import {
  createdResponse,
  conflictResponse,
  // successfulResponse,
  // unauthorizedResponse,
} from 'App/Helpers/Responses';
import { PaystackService } from 'App/Helpers/Paystack';
import Beneficiary from 'App/Models/Beneficiary';
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
}
