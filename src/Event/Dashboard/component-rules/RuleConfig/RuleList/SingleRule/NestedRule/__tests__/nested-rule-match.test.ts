import {AND, Condition, OR, Rule} from 'Event/Dashboard/component-rules'
import faker from 'faker'
import {
  GROUP,
  GroupRule,
  IS,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import {hasMatch} from 'Event/Dashboard/component-rules/matcher'
import {NESTED_RULE} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule'

it('should evaluate nested first', () => {
  const {key: key1, target: target1, rule: rule1} = createRule(OR)
  const {key: key2, target: target2, rule: rule2} = createRule(OR)
  const {rule: rule3} = createRule(AND)

  const missingLast = {
    [key1]: target1,
    [key2]: target2,
  }

  // un-nested: evaluates in order
  expect(hasMatch({groups: missingLast}, [rule1, rule2, rule3])).toBe(false)

  // nested: evaluates nested first
  expect(
    hasMatch({groups: missingLast}, [
      rule1,
      {
        source: NESTED_RULE,
        condition: OR,
        rules: [rule2, rule3],
      },
    ]),
  ).toBe(true)
})

it('should handle deeply nested rules', () => {
  const {key: key1, target: target1, rule: rule1} = createRule(AND)
  const {key: key2, target: target2, rule: rule2} = createRule(AND)
  const {key: key3, target: target3, rule: rule3} = createRule(AND)

  // nested all the way down
  const rules: Rule[] = [
    {
      source: NESTED_RULE,
      condition: AND,
      rules: [
        rule3,
        {
          source: NESTED_RULE,
          condition: AND,
          rules: [
            rule2,
            {
              source: NESTED_RULE,
              condition: AND,
              rules: [rule1],
            },
          ],
        },
      ],
    },
  ]

  const missingInner = {
    [key2]: target2,
    [key3]: target3,
  }
  expect(hasMatch({groups: missingInner}, rules)).toBe(false)

  const missingMiddle = {
    [key1]: target1,
    [key3]: target3,
  }
  expect(hasMatch({groups: missingMiddle}, rules)).toBe(false)

  const missingOuter = {
    [key1]: target1,
    [key2]: target2,
  }
  expect(hasMatch({groups: missingOuter}, rules)).toBe(false)

  const hasAll = {
    [key1]: target1,
    [key2]: target2,
    [key3]: target3,
  }
  expect(hasMatch({groups: hasAll}, rules)).toBe(true)
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
