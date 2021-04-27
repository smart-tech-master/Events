import {Agenda} from 'Event/Dashboard/components/AgendaList'
import faker from 'faker'

export const fakeAgenda = (): Agenda => ({
  startDate: faker.date.past().toISOString(),
  endDate: faker.random.boolean() ? faker.date.future().toISOString() : null,
  text: faker.random.words(3),
  link: faker.random.boolean() ? faker.internet.url() : null,
})

export function withAgendas<T>(attributes: T): T {
  return {
    ...attributes,
    agendas: Array.from(
      {length: faker.random.number({min: 0, max: 4})},
      fakeAgenda,
    ),
  }
}
