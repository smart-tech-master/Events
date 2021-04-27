import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render} from '__utils__/render'
import {fakeResource} from 'Event/Dashboard/components/ResourceList/__utils__/factory'
import {fireEvent} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render resources', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      resourceList: {
        description: '',
        resources: [],
      },
    }),
  })

  const {queryByText, rerender, findAllByLabelText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {event},
  )

  expect(queryByText(/resources:/i)).not.toBeInTheDocument()

  const numResources = faker.random.number({min: 1, max: 6})
  const withResources = fakeEvent({
    template: fakeSimpleBlog({
      resourceList: {
        description: '',
        resources: Array.from({length: numResources}, fakeResource),
      },
    }),
  })

  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, {
    event: withResources,
  })

  const resources = await findAllByLabelText('event resource')
  expect(resources.length).toBe(numResources)
})

it('should add a new resource', async () => {
  const dashboard = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources: [],
    },
  })

  const event = fakeEvent({template: dashboard})
  const organization = fakeOrganization()

  const {queryByLabelText, findByLabelText, findAllByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization,
    },
  )

  expect(queryByLabelText('event resource')).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('add resource'))
  expect((await findAllByLabelText('event resource')).length).toBe(1)

  fireEvent.click(await findByLabelText('add resource'))
  expect((await findAllByLabelText('event resource')).length).toBe(2)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceList.resources.length).toBe(2)
})

it('should update resources description', async () => {
  const description = faker.random.words(5)

  const dashboard = fakeSimpleBlog({
    resourceList: {
      description,
      resources: [],
    },
  })

  const event = fakeEvent({template: dashboard})
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
    },
  )

  expect((await findByLabelText('resource description')).textContent).toBe(
    description,
  )

  clickEdit(await findByLabelText('resources'))

  const updatedDescription = faker.random.words(5)

  user.type(
    await findByLabelText('update resources description'),
    updatedDescription,
  )

  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findByLabelText('resource description')).textContent).toBe(
    updatedDescription,
  )

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceList.description).toBe(updatedDescription)
})

it('should update a resource', async () => {
  const name = faker.random.word()

  const dashboard = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources: [fakeResource({name})],
    },
  })

  const event = fakeEvent({template: dashboard})
  const organization = fakeOrganization()

  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization,
    },
  )

  expect((await findByLabelText('resource link')).textContent).toBe(name)

  clickEdit(await findByLabelText('event resource'))

  const updatedName = faker.random.word()
  user.type(await findByLabelText('resource name'), updatedName)

  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findByLabelText('resource link')).textContent).toBe(updatedName)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceList.resources[0].name).toBe(updatedName)
})

it('should remove a resource', async () => {
  const resources = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeResource,
  )

  const dashboard = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources,
    },
  })
  const event = fakeEvent({template: dashboard})
  const organization = fakeOrganization()

  const {findAllByLabelText, findByLabelText, queryByText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization,
    },
  )

  expect((await findAllByLabelText('event resource')).length).toBe(
    resources.length,
  )

  const targetIndex = faker.random.number({min: 0, max: resources.length - 1})
  const targetName = resources[targetIndex].name

  clickEdit((await findAllByLabelText('event resource'))[targetIndex])

  fireEvent.click(await findByLabelText('remove resource'))

  expect((await findAllByLabelText('event resource')).length).toBe(
    resources.length - 1,
  )

  expect(queryByText(targetName)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.resourceList.resources.length).toBe(resources.length - 1)
})
