import faker from 'faker'
import {Organization} from 'organization'

export const fakeOrganization = (
  overrides?: Partial<Organization>,
): Organization => ({
  id: faker.random.number({min: 1, max: 1000}),
  name: faker.company.companyName(),
  slug: faker.internet.domainWord(),
  joined: faker.random.boolean(),
  updated_at: faker.date.past().toISOString(),
  created_at: faker.date.past().toISOString(),
  ...overrides,
})
