import { ResponseObject, ResponseToolkit } from '@hapi/hapi'

export default class ResponseRenderer {
  response (h: ResponseToolkit, status: string, message: string, data: any, code: number): ResponseObject {
    return h.response({ status, message, data }).code(code)
  }

  success (h, message, data, code = 200): ResponseObject {
    return this.response(h, 'success', message, data, code)
  }

  fail (h, message, code = 400): ResponseObject {
    return this.response(h, 'fail', message, undefined, code)
  }
}
