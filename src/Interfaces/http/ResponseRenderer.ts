import { ResponseObject, ResponseToolkit } from '@hapi/hapi'

export default class ResponseRenderer {
  response (h: ResponseToolkit, status: string, message: string, data: any, code: number): ResponseObject {
    return h.response({ status, message, data }).code(code)
  }
}
