import {
  RIBBONS,
  TicketRibbon,
} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import faker from 'faker'

export const fakeTicketRibbon = (
  overrides?: Partial<TicketRibbon>,
): TicketRibbon => ({
  name: faker.random.arrayElement(RIBBONS),
  text: faker.random.word(),
  color: '#FFFFFF',
  group_name: '',
  group_value: '',
  ...overrides,
})

export function withTicketRibbons<T>(attributes: T): T {
  return {
    ...attributes,
    ticketRibbons: Array.from(
      {length: faker.random.number({min: 1, max: 3})},
      fakeTicketRibbon,
    ),
  }
}
