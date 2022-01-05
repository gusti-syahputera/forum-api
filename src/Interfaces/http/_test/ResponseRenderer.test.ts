import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'
import { ResponseObject, ResponseToolkit } from '@hapi/hapi'

import ResponseRenderer from '../ResponseRenderer'

describe('ResponseRenderer', () => {
  it('produces a Hapi\'s ResponseObject', () => {
    // Arrange mocks and spies
    const responseMock = createMock<ResponseObject>()
    const spyCodeMethod = jest.spyOn(responseMock, 'code')

    const responseToolkitMock = createMock<ResponseToolkit>()
    const spyResponseMethod: jest.Mock = On(responseToolkitMock)
      .get(method(mock => mock.response))
      .mockReturnValue(responseMock)

    // Arrange inputs
    const h = responseToolkitMock
    const status = 'success'
    const message = 'Response berhasil dibuat'
    const data = { foo: 'bar' }
    const code = 201

    // Action
    const renderer = new ResponseRenderer()
    const response: ResponseObject = renderer.response(h, status, message, data, code)

    // Assert
    expect(spyResponseMethod).toBeCalledWith({ status, message, data })
    expect(spyCodeMethod).toBeCalledWith(code)
  })

  it('produces a "success" response', () => {
    // Arrange spies
    const renderer = new ResponseRenderer()
    const spyResponseMethod = jest.spyOn(renderer, 'response')

    // Arrange inputs
    const h = createMock<ResponseToolkit>()
    const message = 'Response berhasil dibuat'
    const data = { foo: 'bar' }
    const customCode = 201

    // Action
    const response1: ResponseObject = renderer.success(h, message, data) // optional code
    const response2: ResponseObject = renderer.success(h, message, data, customCode)

    // Assert
    expect(spyResponseMethod).toBeCalledWith(h, 'success', message, data, 200)
    expect(spyResponseMethod).toBeCalledWith(h, 'success', message, data, customCode)
  })

  it('produces a "fail" response', () => {
    // Arrange spies
    const renderer = new ResponseRenderer()
    const spyResponseMethod = jest.spyOn(renderer, 'response')

    // Arrange inputs
    const h = createMock<ResponseToolkit>()
    const message = 'Anda membuat kesalahan'
    const customCode = 404

    // Action
    const response1: ResponseObject = renderer.fail(h, message) // optional code
    const response2: ResponseObject = renderer.fail(h, message, customCode)

    // Assert
    expect(spyResponseMethod).toBeCalledWith(h, 'fail', message, undefined, 400)
    expect(spyResponseMethod).toBeCalledWith(h, 'fail', message, undefined, customCode)
  })

  it('produces an "internal error" response', () => {
    // Arrange spies
    const defaultMessage = 'Terjadi kegagalan pada server'
    const renderer = new ResponseRenderer(defaultMessage)
    const spyResponseMethod = jest.spyOn(renderer, 'response')

    // Arrange inputs
    const h = createMock<ResponseToolkit>()
    const customMessage = 'Radiasi kosmik menyebabkan server kami tidak dapat memproses request Anda'
    const customCode = 501

    // Action
    const response1: ResponseObject = renderer.internalError(h) // optional message
    const response2: ResponseObject = renderer.internalError(h, customMessage)
    const response3: ResponseObject = renderer.internalError(h, customMessage, customCode)

    // Assert
    expect(spyResponseMethod).toBeCalledWith(h, 'error', defaultMessage, undefined, 500)
    expect(spyResponseMethod).toBeCalledWith(h, 'error', customMessage, undefined, 500)
    expect(spyResponseMethod).toBeCalledWith(h, 'error', customMessage, undefined, customCode)
  })
})
