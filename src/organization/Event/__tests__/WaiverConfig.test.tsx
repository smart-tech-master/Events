import faker from 'faker'
import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import App from 'App'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import {waiverLogoPath} from 'Event/Step2/Waiver'
import {goToEvent} from 'organization/Event/__utils__/event'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show waiver config', async () => {
  // Patch fetch to automatically return the existing waiver logo blob
  // @ts-ignore
  window.fetch = jest.fn(() =>
    Promise.resolve(() => ({blob: jest.fn(() => [])})),
  )
  const mockedFetch = window.fetch as jest.Mock

  const {findByLabelText, event} = await goToWaiverConfig()
  expect(await findByLabelText('waiver body')).toBeInTheDocument()

  if (!event.waiver || !event.waiver.logo) {
    throw new Error(`Missing event waiver logo required for test`)
  }

  expect(mockedFetch).toHaveBeenCalledTimes(1)
  expect(mockedFetch.mock.calls[0][0]).toBe(waiverLogoPath(event.waiver.logo))
})

it('should submit a waiver', async () => {
  window.URL.createObjectURL = jest.fn()
  const event = fakeEvent({waiver: null})
  const {findByLabelText} = await goToWaiverConfig({event})

  const title = faker.random.words(3)
  user.type(await findByLabelText('waiver title'), title)

  // Manually set body input because we can't type into CKEditor
  const body = faker.lorem.paragraph()
  const bodyEl = (await findByLabelText('waiver body')) as HTMLInputElement
  bodyEl.value = body

  const image = new File([], 'logo.jpg')
  const imageInput = await findByLabelText('logo input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  user.click(await findByLabelText('save waiver'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const data = mockPost.mock.calls[0][1]

  expect(data.get('title')).toBe(title)
  expect(data.get('body')).toBe(`<p>${body}</p>`) // CKEditor automatically converts to HTML
  expect(data.get('logo')).toBe(image)
})

async function goToWaiverConfig(overrides: {event?: ObvioEvent} = {}) {
  const data = goToEvent(overrides)
  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))
  user.click(await renderResult.findByLabelText('configure waiver'))

  return {...data, ...renderResult}
}
