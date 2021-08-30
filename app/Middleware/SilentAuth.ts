import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { badRequestResponse, unauthorizedResponse } from 'App/Helpers/Responses'
import { decodeToken } from 'App/Helpers/Authentication'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  /**
   * Handle request
   */
  public async handle ({ auth }: HttpContextContract, next: () => Promise<void>) {
    const authorization = request.headers().authorization
    if (!authorization) {
      return unauthorizedResponse({ response, message: `Unauthorized access` })
    }  
    const token = authorization.replace('Bearer ', '')
    const { user_id, email } = decodeToken(token)

    /**
     * Check if user is logged-in or not. If yes, then `ctx.auth.user` will be
     * set to the instance of the currently logged in user.
     */
    await auth.check()
    await next()
  }
}
