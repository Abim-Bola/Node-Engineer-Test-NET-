import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'

type DecodedToken = {
  email: string,
  user_id: number
}

export const getUserToken = (email, user_id) => {
  const data: DecodedToken = { email, user_id }
  const token = jwt.sign(data, Env.get('APP_KEY'))

  return {
    type: 'bearer',
    token,
  }
}

export const decodeToken = (token): DecodedToken => {
  const decoded = jwt.verify(token, Env.get('APP_KEY'))
  return decoded
}
