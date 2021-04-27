import HiddenOnMatch from 'Event/Dashboard/component-rules/HiddenOnMatch'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import React from 'react'
import faker from 'faker'
import {AND} from 'Event/Dashboard/component-rules'
import {render} from '__utils__/render'
import {
  INCLUDE,
  TAGS,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'

it('should render depending on rule match', () => {
  const testId = faker.random.word()
  const TestComponent = () => <div data-testid={testId}></div>

  const {queryByTestId, rerender} = render(
    <AttendeeProfileProvider groups={{}} tags={[]}>
      <HiddenOnMatch rules={[]}>
        <TestComponent />
      </HiddenOnMatch>
    </AttendeeProfileProvider>,
  )

  expect(queryByTestId(testId)).toBeInTheDocument()

  const targetTag = faker.random.word()
  rerender(
    <AttendeeProfileProvider groups={{}} tags={[targetTag]}>
      <HiddenOnMatch
        rules={[
          {
            condition: AND,
            source: TAGS,
            type: INCLUDE,
            target: targetTag,
          },
        ]}
      >
        <TestComponent />
      </HiddenOnMatch>
    </AttendeeProfileProvider>,
  )

  expect(queryByTestId(testId)).not.toBeInTheDocument()
})
