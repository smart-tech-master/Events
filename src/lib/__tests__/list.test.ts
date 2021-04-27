import {createEntityList} from 'lib/list'
import faker from 'faker'

it('should handle an empty list', () => {
  expect(createEntityList([])).toMatchObject({
    entities: {},
    ids: [],
  })
})

it('should turn an array of objects into an entity list', () => {
  const createPerson = () => ({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    age: faker.random.number({min: 10, max: 20}),
  })

  const items = Array.from(
    {
      length: faker.random.number({min: 1, max: 3}),
    },
    createPerson,
  )

  const list = createEntityList(items)

  expect(list.ids.length).toBe(items.length)

  for (const val of Object.values(list.entities)) {
    const hasSameData = !!items.find(
      (item) => item.age === val.age && item.name === val.name,
    )

    expect(hasSameData).toBe(true)
  }
})
