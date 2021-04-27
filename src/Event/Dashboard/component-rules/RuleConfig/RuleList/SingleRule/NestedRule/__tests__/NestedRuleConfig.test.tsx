import RuleConfig from 'Event/Dashboard/component-rules/RuleConfig'
import faker from 'faker'
import user from '@testing-library/user-event'
import React from 'react'
import {inputElementFor, render} from '__utils__/render'
import {AND} from 'Event/Dashboard/component-rules'
import {fireEvent} from '@testing-library/react'
import {
  GROUP,
  IS,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import {NESTED_RULE} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import {
  INCLUDE,
  TAGS,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'

it('should add a nested rule', () => {
  const updateRules = jest.fn()

  const {getByLabelText} = render(
    <RuleConfig
      rules={[]}
      onChange={updateRules}
      visible={true}
      close={() => {}}
    >
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  user.click(getByLabelText('add rule'))

  fireEvent.change(inputElementFor(getByLabelText('pick rule source')), {
    target: {
      value: NESTED_RULE,
    },
  })

  user.click(getByLabelText('add rule'))

  // Add child group rule
  fireEvent.change(inputElementFor(getByLabelText('pick rule source')), {
    target: {
      value: GROUP,
    },
  })

  fireEvent.change(inputElementFor(getByLabelText('pick group rule type')), {
    target: {
      value: IS,
    },
  })

  const target = faker.random.word()
  user.type(getByLabelText('new group target'), target)

  // Save child rule
  user.click(getByLabelText('save rule'))
  // Save nested rule
  user.click(getByLabelText('save rule'))

  expect(updateRules).toHaveBeenCalledTimes(1)
  const addedRule = updateRules.mock.calls[0][0][0]
  expect(addedRule.condition).toBe(AND)

  // Has correct child rule
  expect(addedRule.rules[0].type).toBe(IS)
  expect(addedRule.rules[0].target).toBe(target)
})

it('should edit a nested rule', () => {
  const updateRules = jest.fn()
  const originalTarget = faker.random.word()

  const {getByLabelText, getByText} = render(
    <RuleConfig
      rules={[
        {
          condition: AND,
          source: NESTED_RULE,
          rules: [
            {
              condition: AND,
              source: TAGS,
              type: INCLUDE,
              target: originalTarget,
            },
          ],
        },
      ]}
      onChange={updateRules}
      visible={true}
      close={() => {}}
    >
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  fireEvent.click(getByLabelText('nested rule'))

  user.click(getByText(new RegExp(originalTarget)))

  const newTarget = faker.random.word()
  user.type(getByLabelText('new tag target'), newTarget)

  // save child rule
  user.click(getByLabelText('save rule'))
  // save nested rule
  user.click(getByLabelText('save rule'))

  expect(updateRules).toHaveBeenCalledTimes(1)
  const updated = updateRules.mock.calls[0][0][0].rules[0]
  expect(updated.target).toBe(newTarget)
})
