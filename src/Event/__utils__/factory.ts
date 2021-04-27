import {ObvioEvent} from 'Event'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import faker from 'faker'

export const fakeEvent = (overrides?: Partial<ObvioEvent>): ObvioEvent => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: faker.company.companyName(),
  slug: faker.internet.domainWord(),
  template: fakeSimpleBlog(),
  speaker_page: {title: 'SPEAKERS', speakers: []},
  waiver: fakeWaiver(),
  tech_check: fakeTechCheck(),
  ...overrides,
})

export function fakeWaiver(
  overrides?: Partial<ObvioEvent['waiver']>,
): ObvioEvent['waiver'] {
  return {
    logo: faker.random.alphaNumeric(10) + '.png',
    title: faker.company.companyName(),
    body: `<html><h1>${faker.company.bsNoun()} Waiver</h1><p>${faker.lorem.paragraphs(
      3,
    )}</p></html>`,
    ...overrides,
  }
}

export function fakeTechCheck(
  overrides?: Partial<ObvioEvent['tech_check']>,
): ObvioEvent['tech_check'] {
  return {
    body: `<html><h1>${faker.company.bsNoun()} Tech Check</h1><p>${faker.lorem.paragraphs(
      3,
    )}</p></html>`,
    is_enabled: true,
    ...overrides,
  }
}
