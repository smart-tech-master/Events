import faker from 'faker'
import axios from 'axios'
import user from '@testing-library/user-event'
import {goToAttendeeList} from 'organization/Event/AttendeeList/__utils__/attendee-list'
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock

beforeAll(() => {
  // Hide JSDOM nav unimplemented error
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should save attendees', async (done) => {
  const csv = faker.random.alphaNumeric(20)

  window.URL.createObjectURL = jest.fn()
  window.URL.revokeObjectURL = jest.fn()

  const {findByLabelText} = await goToAttendeeList()

  mockGet.mockImplementationOnce(() => Promise.resolve({data: {data: csv}}))

  user.click(await findByLabelText('export attendees'))

  await wait(() => {
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })

  const blob = (window.URL.createObjectURL as jest.Mock).mock.calls[0][0]

  // Test that we are downloading returned file contents
  const reader = new FileReader()
  reader.addEventListener('loadend', () => {
    expect(reader.result).toBe(csv)
    done()
    // reader.result contains the contents of blob as a typed array
  })
  reader.readAsText(blob)
})
