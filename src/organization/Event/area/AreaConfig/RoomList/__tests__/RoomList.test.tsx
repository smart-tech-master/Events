import App from 'App'
import {goToEvent} from 'organization/Event/__utils__/event'
import React from 'react'
import {render} from '__utils__/render'
import faker from 'faker'
import axios from 'axios'
import {fakeRoom} from 'organization/Event/area/AreaList/__utils__/factory'
import user from '@testing-library/user-event'

const mockGet = axios.get as jest.Mock

it('should render list of rooms', async () => {
  const {event, areas} = goToEvent()

  const {findByLabelText, findByText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))

  user.click(await findByLabelText(`view ${event.name}`))
  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  for (const room of rooms) {
    expect(await findByText(room.name)).toBeInTheDocument()
  }
})
