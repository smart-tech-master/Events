import {AND, OR} from 'Event/Dashboard/component-rules'
import {hasMatch} from 'Event/Dashboard/component-rules/matcher'
import {
  IS_NOT,
  GROUP,
  GroupRule,
  IS,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import faker from 'faker'

it('should check for match', () => {
  const key = faker.random.word()
  const target = faker.random.word()
  const rule: GroupRule = {
    condition: AND,
    source: GROUP,
    type: IS,
    key,
    target,
  }

  const groups = {
    [key]: target,
  }

  expect(hasMatch({groups}, [rule])).toBe(true)
})

it('should check for is not match', () => {
  const key = faker.random.word()
  const target = faker.random.word()
  const rule: GroupRule = {
    condition: AND,
    source: GROUP,
    type: IS_NOT,
    key,
    target,
  }

  const groups = {
    foo: 'bar',
  }

  expect(hasMatch({groups}, [rule])).toBe(true)
})

it('should check for both groups', () => {
  const key1 = faker.random.word()
  const target1 = faker.random.word()
  const rule1: GroupRule = {
    condition: AND,
    source: GROUP,
    type: IS,
    key: key1,
    target: target1,
  }

  const key2 = faker.random.word()
  const target2 = faker.random.word()
  const rule2: GroupRule = {
    condition: AND,
    source: GROUP,
    type: IS,
    key: key2,
    target: target2,
  }

  const rules = [rule1, rule2]

  const hasNone = {}
  expect(hasMatch({groups: hasNone}, rules)).toBe(false)

  const onlyOne = {
    [key1]: target1,
  }
  expect(hasMatch({groups: onlyOne}, rules)).toBe(false)

  const hasOther = {
    foo: 'bar',
    baz: 'quex',
  }
  expect(hasMatch({groups: hasOther}, rules)).toBe(false)

  const hasBoth = {
    [key1]: target1,
    [key2]: target2,
  }
  expect(hasMatch({groups: hasBoth}, rules)).toBe(true)
})

it('should check if it has at least one', () => {
  const key1 = faker.random.word()
  const target1 = faker.random.word()
  const rule1: GroupRule = {
    condition: AND,
    source: GROUP,
    type: IS,
    key: key1,
    target: target1,
  }

  const key2 = faker.random.word()
  const target2 = faker.random.word()
  const rule2: GroupRule = {
    condition: OR,
    source: GROUP,
    type: IS,
    key: key2,
    target: target2,
  }

  const rules = [rule1, rule2]

  const hasNone = {}
  expect(hasMatch({groups: hasNone}, rules)).toBe(false)

  const hasFirst = {
    [key1]: target1,
  }
  expect(hasMatch({groups: hasFirst}, rules)).toBe(true)

  const hasSecond = {
    [key2]: target2,
  }
  expect(hasMatch({groups: hasSecond}, rules)).toBe(true)

  const hasOther = {
    foo: 'bar',
    baz: 'quex',
  }
  expect(hasMatch({groups: hasOther}, rules)).toBe(false)

  const hasBoth = {
    [key1]: target1,
    [key2]: target2,
  }
  expect(hasMatch({groups: hasBoth}, rules)).toBe(true)
})
