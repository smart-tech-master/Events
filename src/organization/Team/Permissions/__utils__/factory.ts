import {
  Permission,
  Role,
} from 'organization/Team/Permissions/PermissionsProvider'
import faker from 'faker'

export const fakeRole = (overrides?: Partial<Role>): Role => ({
  id: faker.random.number({min: 1000, max: 2000}),
  name: faker.random.word(),
  permissions: [],
  ...overrides,
})

export const fakePermission = (): Permission => faker.random.word()
