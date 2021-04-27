import {fireEvent, wait} from '@testing-library/react'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import axios from 'axios'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show step 2 on login', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })
  const {findByLabelText} = await loginToEventSite({attendee})

  expect(await findByLabelText('signature canvas')).toBeInTheDocument()
})

it('should submit attendee waiver', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })

  const withWaver = fakeAttendee({
    has_password: true,
    waiver: 'waiver.jpg',
  })

  const {findByLabelText, queryByLabelText} = await loginToEventSite({attendee})

  const canvas = ((await findByLabelText(
    'signature canvas',
  )) as unknown) as HTMLCanvasElement

  const signature = 'data:image/png;base64'
  //@ts-ignore
  canvas.toDataURL.mockReturnValueOnce(signature) // mocked via jest-canvas-mock

  const down = new MouseEvent('mousedown', {
    button: 1,
    bubbles: true,
  })

  Object.defineProperty(down, 'which', {
    value: 1,
  })

  fireEvent(canvas, down)

  const up = new MouseEvent('mouseup', {
    button: 1,
    bubbles: true,
  })

  // Have to manually set 'which' because that's what SignaturePad uses
  // to check the mouse button
  Object.defineProperty(up, 'which', {
    value: 1,
  })

  fireEvent(canvas, up)

  fireEvent.click(await findByLabelText('agree to waiver checkbox'))

  mockPost.mockImplementationOnce(() => Promise.resolve({data: withWaver}))

  fireEvent.click(await findByLabelText('submit waiver button'))

  // Moved on to next step
  await wait(async () => {
    expect(queryByLabelText('signature canvas')).not.toBeInTheDocument()
  })
})
