import { ResponseObject, ResponseToolkit } from '@hapi/hapi'

export default class ResponseRenderer {
  constructor (private readonly defaultErrorMessage = 'internal error has occured') {}

  response = (h: ResponseToolkit, code: number, status: string, message?: string, data?: any): ResponseObject =>
    h.response({ status, message, data }).code(code);

  success = (h: ResponseToolkit, message?: string, data?: any, code = 200): ResponseObject =>
    this.response(h, code, 'success', message, data);

  fail = (h: ResponseToolkit, message: string, code = 400): ResponseObject =>
    this.response(h, code, 'fail', message);

  internalError = (h: ResponseToolkit, message = this.defaultErrorMessage, code = 500): ResponseObject =>
    this.response(h, code, 'error', message);
}
