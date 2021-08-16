import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SignUpValidator {
  constructor (protected ctx: HttpContextContract) {}
	public schema = schema.create({
		email: schema.string({}, [
		  rules.email(),
		  rules.unique({ table: 'users', column: 'email' }),
		]),
		password: schema.string({}, [rules.minLength(6)]),
		first_name: schema.string(),
		last_name: schema.string(),
	})

	 public messages = {
		'email.email': 'Your email address is invalid',
		'email.unique': 'This email address has been used before, please use another email',
		'first_name.required': 'Your firstname is required',
		'last_name.required': 'Your lastname is required',
	  }
}
