import {AND} from 'Event/Dashboard/component-rules'
import faker from 'faker'
import {hasMatch} from 'Event/Dashboard/component-rules/matcher'
import {
  DOES_NOT_INCLUDE,
  INCLUDE,
  TAGS,
  TagsRule,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'

it('should check for includes', () => {
  const tag = faker.random.word()

  const tags = [
    ...Array.from(
      {length: faker.random.number({min: 1, max: 5})},
      faker.random.word,
    ),
    tag,
  ]

  const rule: TagsRule = {
    condition: AND,
    source: TAGS,
    type: INCLUDE,
    target: tag,
  }

  expect(hasMatch({tags}, [rule])).toBe(true)
})

it('should check for doese not include', () => {
  const tag = faker.random.word()

  const tags = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    faker.random.word,
  )

  const rule: TagsRule = {
    condition: AND,
    source: TAGS,
    type: DOES_NOT_INCLUDE,
    target: tag,
  }

  expect(hasMatch({tags}, [rule])).toBe(true)
})
