import { ResponseObject, ResponseToolkit } from '@hapi/hapi'

export default class ResponseRenderer {
  constructor (private readonly defaultErrorMessage = 'internal error has occured') {}

  response (h: ResponseToolkit, status: string, message: string|undefined = undefined, data: any, code: number): ResponseObject {
    return h.response({ status, message, data }).code(code)
  }

  success (h: ResponseToolkit, message: string|undefined = undefined, data?: any, code = 200): ResponseObject {
    return this.response(h, 'success', message, data, code)
  }

  fail (h: ResponseToolkit, message: string, code = 400): ResponseObject {
    return this.response(h, 'fail', message, undefined, code)
  }

  internalError (h: ResponseToolkit, message = this.defaultErrorMessage, code = 500): ResponseObject {
    return this.response(h, 'error', message, undefined, code)
  }
}
