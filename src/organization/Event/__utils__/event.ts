import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import faker from 'faker'
import {fakeArea} from 'organization/Event/area/AreaList/__utils__/factory'
import {Area} from 'organization/Event/area/AreaList'

const mockGet = axios.get as jest.Mock

export function goToEvent(
  overrides: {event?: ObvioEvent; areas?: Area[]} = {},
) {
  const event = overrides.event || fakeEvent()
  const areas =
    overrides.areas ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeArea)

  const orgData = signInToOrganization({events: [event]})

  // Fetch target event
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))
  // areas
  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))

  return {event, areas, ...orgData}
}
