import {client} from '../api-client'
import mockAxios from 'axios'

afterEach(() => {
  jest.clearAllMocks()
})

const mockGet = mockAxios.get as jest.Mock
const mockPut = mockAxios.put as jest.Mock
const mockPost = mockAxios.post as jest.Mock
const mockDelete = mockAxios.delete as jest.Mock

it('should send default headers', async () => {
  mockGet.mockImplementation(() => Promise.resolve('ok'))
  await client.get('/test')

  expect(mockGet).toHaveBeenCalledTimes(1)
  const firstCall = mockGet.mock.calls[0]
  expect(firstCall[1].headers).toMatchObject({
    'content-type': 'application/json',
  })
})

it('should send custom config', async () => {
  mockGet.mockImplementation(() => Promise.resolve('ok'))
  await client.get('/test', {
    headers: {
      foo: 'bar',
    },
  })

  expect(mockGet).toHaveBeenCalledTimes(1)
  const firstCall = mockGet.mock.calls[0]
  expect(firstCall[1].headers.foo).toBe('bar')
})

it('should send a get request', async () => {
  const url = '/foo/bar'
  const customHeaders = {
    name: 'mike',
  }
  mockGet.mockImplementation(() => Promise.resolve('ok'))
  await client.get(url, {headers: customHeaders})

  expect(mockGet).toHaveBeenCalledTimes(1)
  const firstCall = mockGet.mock.calls[0]
  expect(firstCall[0]).toBe(url)

  expect(firstCall[1].headers).toMatchObject({
    'content-type': 'application/json',
    ...customHeaders,
  })
})

it('should send a post request', async () => {
  const url = '/foo/bar'
  const customHeaders = {
    name: 'mike',
  }
  const data = {
    foo: 'bar',
  }
  mockPost.mockImplementation(() => Promise.resolve('ok'))
  await client.post(url, data, {headers: customHeaders})

  expect(mockPost).toHaveBeenCalledTimes(1)
  const firstCall = mockPost.mock.calls[0]
  expect(firstCall[0]).toBe(url)
  expect(firstCall[1]).toMatchObject(data)

  expect(firstCall[2].headers).toMatchObject({
    'content-type': 'application/json',
    ...customHeaders,
  })
})

it('should send a put request', async () => {
  const url = '/foo/bar'
  const customHeaders = {
    name: 'mike',
  }
  const data = {
    foo: 'bar',
  }

  mockPut.mockImplementation(() => Promise.resolve('ok'))
  await client.put(url, data, {headers: customHeaders})

  expect(mockPut).toHaveBeenCalledTimes(1)
  const firstCall = mockPut.mock.calls[0]
  expect(firstCall[0]).toBe(url)
  expect(firstCall[1]).toMatchObject(data)

  expect(firstCall[2].headers).toMatchObject({
    'content-type': 'application/json',
    ...customHeaders,
  })
})

it('should throw an error from message from response', async () => {
  expect.assertions(1)
  const message = 'something went wrong'
  mockGet.mockImplementation(() =>
    Promise.reject({
      response: {
        data: message,
      },
    }),
  )
  try {
    await client.get('/test')
  } catch (error) {
    expect(error).toBe(message)
  }
})

it('should send a delete request', async () => {
  const url = '/foo/bar'
  const customHeaders = {
    name: 'mike',
  }
  mockDelete.mockImplementation(() => Promise.resolve('ok'))
  await client.delete(url, {headers: customHeaders})

  expect(mockDelete).toHaveBeenCalledTimes(1)
  const firstCall = mockDelete.mock.calls[0]
  expect(firstCall[0]).toBe(url)

  expect(firstCall[1].headers).toMatchObject({
    'content-type': 'application/json',
    ...customHeaders,
  })
})

it('should throw a normal error', async () => {
  expect.assertions(1)
  const message = 'something went wrong'
  mockGet.mockImplementation(() => Promise.reject(message))
  try {
    await client.get('/test')
  } catch (error) {
    expect(error.message).toBe(message)
  }
})
