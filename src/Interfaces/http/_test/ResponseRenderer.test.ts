import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'
import { ResponseObject, ResponseToolkit } from '@hapi/hapi'

import ResponseRenderer from '../ResponseRenderer'

describe('ResponseRenderer', () => {
  it('should call Hapi\'s toolkit methods in order to produce a ResponseObject', () => {
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

  it('should call self `response` methods in order to produce a "success" response', () => {
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

  it('should call self `response` methods in order to produce a "fail" response', () => {
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
})
