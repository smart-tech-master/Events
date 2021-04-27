import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render, renderWithEvent} from '__utils__/render'
import {fakePoints} from 'Event/Dashboard/components/PointsSummary/__utils__/factory'
import {fireEvent, wait} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render points', async () => {
  const withoutPoints = fakeEvent({template: fakeSimpleBlog({points: null})})

  const {queryByText, rerender, findByText} = renderWithEvent(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    withoutPoints,
  )

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  const points = fakePoints()

  const withPoints = fakeEvent({
    template: fakeSimpleBlog({
      points,
    }),
  })

  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, withPoints)

  const pointsText = new RegExp(
    `you've earned ${points.numPoints} ${points.unit}!`,
    'i',
  )

  expect(await findByText(pointsText)).toBeInTheDocument()
})

it('should configure points', async () => {
  const event = fakeEvent({template: fakeSimpleBlog({points: null})})
  const {queryByText, findByLabelText, findByText} = renderWithEvent(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    event,
  )

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('set points'))

  const unit = faker.random.word()
  user.type(await findByLabelText('points unit'), unit)

  fireEvent.click(await findByLabelText('close config dialog'))

  const pointsText = new RegExp(`you've earned 0 ${unit}!`, 'i')

  expect(await findByText(pointsText)).toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.points).not.toBeNull()
})

it('should remove points', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      points: fakePoints({numPoints: 0}),
    }),
  })

  const {queryByText, findByLabelText, findByText} = render(
    <StaticEventProvider event={event}>
      <Dashboard isEditMode={true} user={fakeUser()} />
    </StaticEventProvider>,
  )

  expect(await findByText(/you've earned 0 .*/i)).toBeInTheDocument()

  clickEdit(await findByLabelText('points summary'))

  fireEvent.click(await findByLabelText('remove points'))

  await wait(() => {
    expect(queryByText(/you've earned/i)).not.toBeInTheDocument()
  })

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.points).toBeNull()
})
