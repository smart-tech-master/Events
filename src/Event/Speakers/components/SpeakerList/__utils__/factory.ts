import {Speaker} from 'Event'
import faker from 'faker'

export const fakeSpeaker = (): Speaker => ({
  id: 0,
  image: '',
  image_url: '',
  name: faker.random.words(3),
  text: faker.random.words(3),
})

export function withSpeakers<T>(attributes: T): T {
  return {
    ...attributes,
    speakers: Array.from(
      {length: faker.random.number({min: 0, max: 4})},
      fakeSpeaker,
    ),
  }
}
