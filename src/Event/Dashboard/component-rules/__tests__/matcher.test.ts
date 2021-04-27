import {AND, Condition, OR} from 'Event/Dashboard/component-rules'
import {hasMatch} from 'Event/Dashboard/component-rules/matcher'
import {
  GROUP,
  GroupRule,
  IS,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import faker from 'faker'

it('should require both conditions to pass', () => {
  const {key: key1, target: target1, rule: rule1} = createRule(AND)
  const {key: key2, target: target2, rule: rule2} = createRule(AND)

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

it('should only require a single condition', () => {
  const {key: key1, target: target1, rule: rule1} = createRule(AND)
  const {key: key2, target: target2, rule: rule2} = createRule(OR)

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

it('should operate in order', () => {
  const {key: key1, target: target1, rule: rule1} = createRule(OR)
  const {key: key2, target: target2, rule: rule2} = createRule(OR)
  const {key: key3, target: target3, rule: rule3} = createRule(AND)

  // left to right
  const rules = [rule1, rule2, rule3]

  const missingFirst = {
    [key2]: target2,
    [key3]: target3,
  }
  expect(hasMatch({groups: missingFirst}, rules)).toBe(true)

  const missingLast = {
    [key1]: target1,
    [key2]: target2,
  }
  expect(hasMatch({groups: missingLast}, rules)).toBe(false)

  const onlyMiddle = {
    [key2]: target2,
  }
  expect(hasMatch({groups: onlyMiddle}, rules)).toBe(false)

  const onlyLast = {
    [key3]: target3,
  }
  expect(hasMatch({groups: onlyLast}, rules)).toBe(false)
})

function createRule(condition: Condition) {
  const key = faker.random.word()
  const target = faker.random.word()
  const rule: GroupRule = {
    condition,
    source: GROUP,
    type: IS,
    key: key,
    target: target,
  }

  return {
    key,
    target,
    rule,
  }
}
