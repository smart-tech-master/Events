import React from 'react'
import faker from 'faker'
import {fireEvent, wait} from '@testing-library/react'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {renderWithEvent} from '__utils__/render'
import {fakeAgenda} from 'Event/Dashboard/components/AgendaList/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render agendas', async () => {
  const withoutAgendas = fakeEvent({template: fakeSimpleBlog({agendas: []})})

  const {queryByText, findAllByLabelText, rerender} = renderWithEvent(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    withoutAgendas,
  )

  expect(queryByText(/agenda/i)).not.toBeInTheDocument()

  const agendas = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    fakeAgenda,
  )

  const withAgendas = fakeEvent({template: fakeSimpleBlog({agendas})})
  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, withAgendas)

  expect((await findAllByLabelText('agenda')).length).toBe(agendas.length)
})

it('should edit an agenda', async () => {
  const agendas = Array.from(
    {length: faker.random.number({min: 2, max: 4})},
    fakeAgenda,
  )

  const dashboard = fakeSimpleBlog({agendas})
  const event = fakeEvent({template: dashboard})

  const {findAllByLabelText, findByLabelText} = renderWithEvent(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    event,
  )

  const targetIndex = faker.random.number({min: 0, max: agendas.length - 1})

  // Renders same values as data
  expect(
    (await findAllByLabelText('agenda event'))[targetIndex].textContent,
  ).toBe(agendas[targetIndex].text)

  clickEdit((await findAllByLabelText('agenda'))[targetIndex])

  const updatedText = faker.random.word()

  user.type(await findByLabelText('agenda text'), updatedText)

  fireEvent.click(await findByLabelText('close config dialog'))

  // Has updated text
  expect(
    (await findAllByLabelText('agenda event'))[targetIndex].textContent,
  ).toBe(updatedText)

  // Saved
  await wait(() => {
    expect(mockRxJsAjax.post).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.agendas[targetIndex].text).toBe(updatedText)
})

it('should add a new agenda', async () => {
  const dashboard = fakeSimpleBlog({agendas: []})
  const event = fakeEvent({template: dashboard})

  const {
    findAllByLabelText,
    findByLabelText,
    queryByLabelText,
  } = renderWithEvent(<Dashboard isEditMode={true} user={fakeUser()} />, event)

  expect(queryByLabelText('agenda')).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('add agenda event'))

  expect((await findAllByLabelText('agenda')).length).toBe(1)

  // Saved
  await wait(() => {
    expect(mockRxJsAjax.post).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.agendas.length).toBe(1)
})

it('should remove an agenda', async () => {
  const agendas = Array.from(
    {length: faker.random.number({min: 2, max: 4})},
    fakeAgenda,
  )

  const dashboard = fakeSimpleBlog({agendas})
  const event = fakeEvent({template: dashboard})

  const {
    queryByText,
    findAllByLabelText,
    findByLabelText,
    findByText,
  } = renderWithEvent(<Dashboard isEditMode={true} user={fakeUser()} />, event)

  const targetIndex = faker.random.number({min: 0, max: agendas.length - 1})

  const targetText = agendas[targetIndex].text

  expect(await findByText(targetText)).toBeInTheDocument()

  clickEdit((await findAllByLabelText('agenda'))[targetIndex])

  fireEvent.click(await findByLabelText('remove agenda'))

  // one less agenda
  expect((await findAllByLabelText('agenda event')).length).toBe(
    agendas.length - 1,
  )

  expect(queryByText(targetText)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.agendas.length).toBe(agendas.length - 1)
})
