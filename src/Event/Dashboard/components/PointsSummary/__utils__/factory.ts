import {Points} from 'Event/Dashboard/components/PointsSummary'
import faker from 'faker'

export const fakePoints = (overrides?: Partial<Points>): Points => ({
  headerImage:
    'https://tax.live/success_summit/images/supercharged-points-banner.png',
  description: faker.lorem.paragraph(1),
  unit: `${faker.random.word()} Rewards`,
  numPoints: faker.random.number({min: 0, max: 1000}),
  leaderboardUrl: 'https://tax.live/leaderboard',
  ...overrides,
})

export function withPoints<T>(attributes: T): T {
  return {
    ...attributes,
    points: fakePoints(),
  }
}
