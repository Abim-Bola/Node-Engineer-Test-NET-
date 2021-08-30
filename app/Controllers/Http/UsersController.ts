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
      const user = await User.query().where('email', email);
      // @ts-ignore
      const serializeUser = user.map((u) => u.serialize())
      console.log(serializeUser[0].password, 'password')
      console.log('user', serializeUser);
      if (!serializeUser) {
        return conflictResponse({
          response,
          message: 'Account doesnt exists',
        });
      }
      const valid_password = await Hash.verify(serializeUser[0].password, password);
      if (!valid_password) {
        return unauthorizedResponse({ response, message: 'Invalid Email or Password' });
      }
      const data = getUserToken(email, serializeUser[0].id);
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
