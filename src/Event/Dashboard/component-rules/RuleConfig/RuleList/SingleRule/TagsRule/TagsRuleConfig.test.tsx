import RuleConfig from 'Event/Dashboard/component-rules/RuleConfig'
import faker from 'faker'
import user from '@testing-library/user-event'
import React from 'react'
import {inputElementFor, render} from '__utils__/render'
import {AND} from 'Event/Dashboard/component-rules'
import {
  DOES_NOT_INCLUDE,
  TAGS,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import {fireEvent} from '@testing-library/react'

it('should add a tag rule', () => {
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

  // Select DOES_NOT_INCLUDE
  fireEvent.change(inputElementFor(getByLabelText('pick tags rule type')), {
    target: {
      value: DOES_NOT_INCLUDE,
    },
  })

  const target = faker.random.word()
  user.type(getByLabelText('new tag target'), target)

  user.click(getByLabelText('save rule'))

  expect(updateRules).toHaveBeenCalledTimes(1)
  const addedRule = updateRules.mock.calls[0][0][0]
  expect(addedRule.condition).toBe(AND)
  expect(addedRule.type).toBe(DOES_NOT_INCLUDE)
  expect(addedRule.target).toBe(target)
})
