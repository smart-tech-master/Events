import React from 'react'
import faker from 'faker'
import RuleConfig from 'Event/Dashboard/component-rules/RuleConfig'
import {inputElementFor, render} from '__utils__/render'
import user from '@testing-library/user-event'
import {fireEvent} from '@testing-library/react'
import {AND} from 'Event/Dashboard/component-rules'
import {
  INCLUDE,
  TAGS,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'

it('should show config, and hide child content', () => {
  const {rerender, getByTestId, queryByTestId} = render(
    <RuleConfig rules={[]} onChange={() => {}} visible={false} close={() => {}}>
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  expect(getByTestId('child-component')).toBeInTheDocument()

  rerender(
    <RuleConfig rules={[]} onChange={() => {}} visible={true} close={() => {}}>
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  expect(queryByTestId('child-component')).not.toBeInTheDocument()
})

it('should add a rule', () => {
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

  // Select tags as source
  fireEvent.change(inputElementFor(getByLabelText('pick rule source')), {
    target: {
      value: TAGS,
    },
  })

  const target = faker.random.word()
  user.type(getByLabelText('new tag target'), target)

  user.click(getByLabelText('save rule'))

  expect(updateRules).toHaveBeenCalledTimes(1)
  const addedRule = updateRules.mock.calls[0][0][0]
  expect(addedRule.condition).toBe(AND)
  expect(addedRule.type).toBe(INCLUDE)
  expect(addedRule.target).toBe(target)
})

it('should edit an existing rule', () => {
  const updateRules = jest.fn()

  const originalTarget = faker.random.word()
  const {getByLabelText, getByText} = render(
    <RuleConfig
      rules={[
        {
          source: TAGS,
          condition: AND,
          type: INCLUDE,
          target: originalTarget,
        },
      ]}
      onChange={updateRules}
      visible={true}
      close={() => {}}
    >
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  user.click(getByText(new RegExp(originalTarget)))

  const newTarget = faker.random.word()
  user.type(getByLabelText('new tag target'), newTarget)

  user.click(getByLabelText('save rule'))

  expect(updateRules).toHaveBeenCalledTimes(1)
  const updated = updateRules.mock.calls[0][0][0]
  expect(updated.target).toBe(newTarget)
})

it('should delete an existing rule', () => {
  const updateRules = jest.fn()

  const target = faker.random.word()
  const {getByLabelText, getByText} = render(
    <RuleConfig
      rules={[
        {
          source: TAGS,
          condition: AND,
          type: INCLUDE,
          target,
        },
      ]}
      onChange={updateRules}
      visible={true}
      close={() => {}}
    >
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  user.click(getByText(new RegExp(target)))
  user.click(getByLabelText('remove rule'))
  const rules = updateRules.mock.calls[0][0]
  expect(rules).toMatchObject([])
})
