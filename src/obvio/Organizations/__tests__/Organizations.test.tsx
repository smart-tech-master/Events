import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import mockAxios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'
import App from 'App'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'

const mockGet = mockAxios.get as jest.Mock

it('should show the user organizations', async () => {
  const token = 'userauthtoken'
  window.localStorage.setItem('__obvio_user_token__', token)
  const numOrganizations = faker.random.number({min: 1, max: 3})
  const organizations = Array.from(
    {
      length: numOrganizations,
    },
    fakeOrganization,
  )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: organizations,
    }),
  )

  const {findByLabelText} = render(<App />)

  // Renders every organization
  for (const o of organizations) {
    expect(await findByLabelText(new RegExp(o.name))).toBeInTheDocument()
  }

  expect(mockGet).toBeCalledTimes(2)
})
