import { createMock } from 'ts-auto-mock'
import { On, method } from 'ts-auto-mock/extension'
import { ResponseObject, ResponseToolkit } from '@hapi/hapi'

import ResponseRenderer from '../ResponseRenderer'

describe('ResponseRenderer', () => {
  it('should call Hapi\'s toolkit methods in order to produce ResponseObject', () => {
    // Arrange mocks
    const responseMock: ResponseObject = createMock<ResponseObject>()
    const spyCodeMethod = jest.spyOn(responseMock, 'code')

    const responseToolkitMock: ResponseToolkit = createMock<ResponseToolkit>()
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
    expect(spyResponseMethod).lastCalledWith({ status, message, data })
    expect(spyCodeMethod).lastCalledWith(code)
  })
})
