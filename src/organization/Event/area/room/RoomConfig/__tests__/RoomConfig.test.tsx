import {goToEvent} from 'organization/Event/__utils__/event'
import user from '@testing-library/user-event'
import React from 'react'
import {render} from '__utils__/render'
import axios from 'axios'
import faker from 'faker'
import App from 'App'
import {fakeRoom} from 'organization/Event/area/AreaList/__utils__/factory'
import {Room} from 'Event/room'
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should toggle a room on/off', async () => {
  const {event, areas} = goToEvent()

  const {findByLabelText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  const targetIndex = faker.random.number({min: 0, max: rooms.length - 1})
  const target = rooms[targetIndex]

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))

  user.click(await findByLabelText(`view ${event.name}`))
  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  // Room to be configured
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))

  // go to room config
  user.click(await findByLabelText(`view ${target.name} room`))

  expect(
    ((await findByLabelText('toggle online')) as HTMLInputElement).checked,
  ).toBe(target.is_online)

  const updated: Room = {
    ...target,
    is_online: !target.is_online,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('toggle online'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPatch.mock.calls[0]

  const endpoint = target.is_online ? 'stop' : 'start'
  expect(url).toMatch(`/rooms/${target.id}/${endpoint}`)
})

it('should update room attributes', async () => {
  const {event, areas} = goToEvent()
  const {findByLabelText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    () => fakeRoom({max_num_attendees: null}),
  )
  const targetIndex = faker.random.number({min: 0, max: rooms.length - 1})
  const target = rooms[targetIndex]

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))

  user.click(await findByLabelText(`view ${event.name}`))
  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  // Room to be configured
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))

  // go to room config
  user.click(await findByLabelText(`view ${target.name} room`))

  const newName = faker.random.word()

  const hasMaxAttendees = faker.random.boolean()
  const maxNumAttendees = faker.random.number({min: 100, max: 400})

  const updated: Room = {
    ...target,
    name: newName,
    max_num_attendees: hasMaxAttendees ? null : maxNumAttendees,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.type(await findByLabelText('room name input'), newName)

  if (hasMaxAttendees) {
    user.click(await findByLabelText('toggle has max num attendees'))
    user.type(
      await findByLabelText('set max number of attendees'),
      String(maxNumAttendees),
    )
  }

  user.click(await findByLabelText('update room'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(`/rooms/${target.id}`)

  expect(data.name).toBe(newName)

  if (hasMaxAttendees) {
    expect(data.max_num_attendees).toBe(maxNumAttendees)
  }
})
