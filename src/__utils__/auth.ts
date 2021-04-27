import faker from 'faker'
import mockAxios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'

const mockGet = mockAxios.get as jest.Mock

export const authenticate = () => {
  const token = faker.random.alphaNumeric()
  window.localStorage.setItem('__obvio_user_token__', token)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))

  return {token}
}
