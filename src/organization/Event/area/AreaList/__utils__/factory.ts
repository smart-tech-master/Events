import {Area} from 'organization/Event/area/AreaList'
import faker from 'faker'
import {Room} from 'Event/room'

export const fakeRoom = (overrides?: Partial<Room>): Room => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: faker.random.words(2),
  is_online: true,
  max_num_attendees: 500,
  ...overrides,
})

export const fakeArea = (overrides?: Partial<Area>): Area => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: faker.random.words(2),
  is_open: true,
  requires_approval: true,
  allows_multiple_devices: false,
  rooms: Array.from({length: faker.random.number({min: 1, max: 10})}, fakeRoom),
  ...overrides,
})
