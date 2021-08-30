import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { badRequestResponse, unauthorizedResponse } from 'App/Helpers/Responses'
import { decodeToken } from 'App/Helpers/Authentication'

export default class Auth {
    public async handle({ response, request }: HttpContextContract, next: () => Promise<void>) {
try {
    const authorization = request.headers().authorization
      if (!authorization) {
        return unauthorizedResponse({ response, message: `Unauthorized access` })
      }  
      const token = authorization.replace('Bearer ', '')
      const { user_id, email } = decodeToken(token)

let user = await User.query()
          .where('email', email);

user = user.map((u) => u.serialize())

      request.updateBody({
        ...request.all(),
        user,
      })
    }
    await next()
} catch (error) {
    return error
}
    }
}