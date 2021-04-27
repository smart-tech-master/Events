import {fakeAttendee} from 'Event/auth/__utils__/factory'
import user from '@testing-library/user-event'
import {loginToEventSite} from 'Event/__utils__/url'
import axios from 'axios'
import {act} from 'react-dom/test-utils'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show step 1 on login', async () => {
  const attendee = fakeAttendee({
    has_password: false,
  })
  const {findByLabelText} = await loginToEventSite({attendee})

  expect(await findByLabelText('password input')).toBeInTheDocument()
})

it('should set an attendee password', async () => {
  const attendee = fakeAttendee({
    has_password: false,
  })

  const updatedAttendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })

  const {findByLabelText} = await loginToEventSite({attendee})

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: updatedAttendee,
    }),
  )

  const password = 'secretpw'
  await act(async () => {
    user.type(await findByLabelText('password input'), password)
    user.type(await findByLabelText('confirm password input'), password)
    user.click(await findByLabelText('submit set password form'))
  })

  expect(await findByLabelText('signature canvas')).toBeInTheDocument()

  expect(mockPost.mock.calls[1][1]['password']).toBe(password)
  expect(mockPost.mock.calls[1][1]['password_confirmation']).toBe(password)
})
