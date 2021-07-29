import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValitator: EmailValidator

  constructor (emailValitator: EmailValidator) {
    this.emailValitator = emailValitator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }

    if (!httpRequest.body.password) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }
    const isValid = this.emailValitator.isValid(httpRequest.body.email)
    if (!isValid) {
      return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
    }
    return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
  }
}
