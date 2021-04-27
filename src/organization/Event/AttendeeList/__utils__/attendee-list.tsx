import React from 'react'
import faker from 'faker'
import {ObvioEvent} from 'Event'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import axios from 'axios'
import App from 'App'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {Attendee} from 'Event/attendee'
import {goToEvent} from 'organization/Event/__utils__/event'

const mockGet = axios.get as jest.Mock

export async function goToAttendeeList(
  overrides: {event?: ObvioEvent; attendees?: Attendee[]} = {},
) {
  const data = goToEvent(overrides)

  const attendees =
    overrides.attendees ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeAttendee)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendees}))

  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))
  user.click(await renderResult.findByLabelText('view attendees'))

  return {...data, ...renderResult}
}
