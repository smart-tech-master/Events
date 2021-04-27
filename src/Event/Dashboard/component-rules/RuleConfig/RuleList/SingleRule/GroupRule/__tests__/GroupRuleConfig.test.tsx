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

it('should add a group rule', () => {
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

  user.click(getByLabelText('save rule'))

  expect(updateRules).toHaveBeenCalledTimes(1)
  const addedRule = updateRules.mock.calls[0][0][0]
  expect(addedRule.condition).toBe(AND)
  expect(addedRule.type).toBe(IS)
  expect(addedRule.target).toBe(target)
})
