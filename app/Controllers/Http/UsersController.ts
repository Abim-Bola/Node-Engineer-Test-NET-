import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import SignUpValidator from 'App/Validators/SignUpValidator';
import {
  createdResponse,
  conflictResponse,
  successfulResponse,
  unauthorizedResponse,
} from 'App/Helpers/Responses';
import LogInValidator from 'App/Validators/LogInValidator';
import { getUserToken } from 'App/Helpers/Authentication';
import Database from '@ioc:Adonis/Lucid/Database';
import Hash from '@ioc:Adonis/Core/Hash';
import User from 'App/Models/User';

export default class UsersController {
  public async signup({ response, request }: HttpContextContract) {
    try {
      const payload = await request.validate(SignUpValidator);
      const { email, first_name, last_name, password } = payload;
      const findUser = await User.query().where('email', email).first();
      if (findUser) {
        return conflictResponse({
          response,
          message: 'Account already exists',
        });
      }
      const user = new User();
      user.email = email.toLowerCase();
      user.password = await Hash.make(password);
      user.first_name = first_name;
      user.last_name = last_name;
      await user.save();
      return createdResponse({
        response,
        message: 'Your account has been created',
      });
    } catch (error) {
      return error;
    }
  }

  public async login({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(LogInValidator);
      const { email, password } = payload;
      const user = await User.query().where('email', email).first();
      // @ts-ignore
      console.log(user)
      if(!user){
        console.log('hey')
        throw new Error('error occcured');
      }
      // @ts-ignore
      const serialize = user.map((u) => {
        console.log(u.serialize())
        return u
        })
      console.log('hmm')
      
      const serializeUser = user.map((u) => u.serialize())
      console.log(serializeUser[0].password, 'password')
      console.log('user', serializeUser);
      if (!serializeUser) {
        return conflictResponse({
          response,
          message: 'Account already exists',
        });
      }
      console.log('1')
      const valid_password = await Hash.verify(password, serializeUser[0].password);
      console.log(valid_password, 'valid');
      console.log('2')
      if (!valid_password) {
        return unauthorizedResponse({ response, message: 'Invalid Email or Password' });
      }
      console.log('3')
      const data = getUserToken(email, serializeUser[0].id);
      console.log('4')
      return successfulResponse({
        response,
        message: 'Login successfully',
        data,
      });
    } catch (error) {
      return error
    }
  }
}
