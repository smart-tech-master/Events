import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render, renderWithEvent} from '__utils__/render'
import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fireEvent} from '@testing-library/react'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render sidebarNavButtons', () => {
  const withoutButtons = fakeEvent({
    template: fakeSimpleBlog({
      sidebarNav: createEntityList([]),
    }),
  })

  const {queryByLabelText, rerender, queryAllByLabelText} = renderWithEvent(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    withoutButtons,
  )

  expect(queryByLabelText(/sidebar nav/i)).not.toBeInTheDocument()

  const numButtons = faker.random.number({min: 1, max: 5})

  const withNavButtons = fakeEvent({
    template: fakeSimpleBlog({
      sidebarNav: createEntityList(
        Array.from({length: numButtons}, fakeNavButton),
      ),
    }),
  })

  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, withNavButtons)

  expect(queryAllByLabelText(/sidebar nav/i).length).toBe(numButtons)
})

it('should add a new sidebar nav button', async () => {
  const numButtons = faker.random.number({min: 1, max: 4})

  const buttons = Array.from(
    {
      length: numButtons,
    },
    fakeNavButton,
  )

  const sidebarNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeSimpleBlog({sidebarNav: sidebarNavButtons}),
  })

  const {findAllByLabelText, findByLabelText} = renderWithEvent(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    event,
  )

  const buttonEls = () => findAllByLabelText('sidebar nav button')

  expect((await buttonEls()).length).toBe(numButtons)

  fireEvent.click(await findByLabelText('add sidebar nav button'))

  expect((await buttonEls()).length).toBe(numButtons + 1)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarNav.ids.length).toBe(numButtons + 1)
})

it('should edit the selected button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButton,
  )

  const sidebarNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeSimpleBlog({sidebarNav: sidebarNavButtons}),
  })
  const {findByLabelText, findByText} = renderWithEvent(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    event,
  )

  const targetIndex = faker.random.number({min: 0, max: buttons.length - 1})
  const button = buttons[targetIndex]
  const buttonEl = await findByText(button.text)

  clickEdit(buttonEl)

  const textInput = (await findByLabelText(
    'button name input',
  )) as HTMLInputElement
  expect(textInput.value).toBe(button.text)

  const updatedValue = faker.random.word()

  fireEvent.change(textInput, {
    target: {
      value: updatedValue,
    },
  })

  fireEvent.click(await findByLabelText('close config dialog'))

  const updatedEl = await findByText(updatedValue)
  expect(updatedEl).toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  const id = data.template.sidebarNav.ids[targetIndex]
  expect(data.template.sidebarNav.entities[id].text).toBe(updatedValue)
})

it('should remove the button', async () => {
  const numButtons = faker.random.number({min: 2, max: 4})

  const buttons = Array.from({length: numButtons}, fakeNavButton)
  const sidebarNavButtons = createEntityList(buttons)

  const event = fakeEvent({
    template: fakeSimpleBlog({sidebarNav: sidebarNavButtons}),
  })
  const {findAllByLabelText, findByLabelText, queryByText} = renderWithEvent(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    event,
  )

  const buttonEls = () => findAllByLabelText('sidebar nav button')
  expect((await buttonEls()).length).toBe(numButtons)

  const target = faker.random.arrayElement(await buttonEls())
  expect(queryByText(target.textContent!)).toBeInTheDocument()

  clickEdit(target)

  fireEvent.click(await findByLabelText('remove button'))

  expect((await buttonEls()).length).toBe(numButtons - 1)

  expect(queryByText(target.textContent!)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarNav.ids.length).toBe(numButtons - 1)
})
