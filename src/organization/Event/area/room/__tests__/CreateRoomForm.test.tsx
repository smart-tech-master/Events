import React from 'react'
import faker from 'faker'
import user from '@testing-library/user-event'
import {goToEvent} from 'organization/Event/__utils__/event'
import {render} from '__utils__/render'
import App from 'App'
import axios from 'axios'
import {fakeRoom} from 'organization/Event/area/AreaList/__utils__/factory'
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

it('should create', async () => {
  const {event, areas} = goToEvent()

  const {findByLabelText, findByText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  user.click(await findByLabelText(`view ${event.name}`))
  user.click(await findByLabelText(`view ${area.name} area`))
  user.click(await findByLabelText(`create room`))

  const name = faker.random.word()
  const hasMaxNumAttendees = faker.random.boolean()
  const maxNumAttendees = faker.random.number({min: 100, max: 300})
  user.type(await findByLabelText('room name input'), name)

  if (hasMaxNumAttendees) {
    user.click(await findByLabelText('toggle has max num attendees'))
    user.type(
      await findByLabelText('set max number of attendees'),
      String(maxNumAttendees),
    )
  }

  const room = fakeRoom()
  // successfully create room
  mockPost.mockImplementationOnce(() => Promise.resolve({data: room}))
  // Fetched room for config
  mockGet.mockImplementationOnce(() => Promise.resolve({data: room}))

  user.click(await findByLabelText('create room'))

  // Shows room config for newly created room
  await wait(async () => {
    expect(
      ((await findByLabelText('room name input')) as HTMLInputElement).value,
    ).toBe(room.name)
  })
})
