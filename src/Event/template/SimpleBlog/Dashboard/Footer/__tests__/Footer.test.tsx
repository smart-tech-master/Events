import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render, renderWithEvent} from '__utils__/render'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render a footer', () => {
  const withoutFields = fakeEvent({
    template: fakeSimpleBlog({
      footer: {
        background: '#000000',
        textColor: '#FFFFFF',
        termsLink: null,
        privacyLink: null,
        copyrightText: null,
      },
    }),
  })

  const {queryByLabelText, rerender, getByText} = renderWithEvent(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    withoutFields,
  )

  expect(queryByLabelText(/terms of service/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).not.toBeInTheDocument()

  const copyrightText = faker.lorem.sentence()

  const withFooter = fakeEvent({
    template: fakeSimpleBlog({
      footer: {
        background: '#000000',
        textColor: '#FFFFFF',
        termsLink: faker.internet.url(),
        privacyLink: faker.internet.url(),
        copyrightText: copyrightText,
      },
    }),
  })

  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, withFooter)

  expect(queryByLabelText(/terms of service/i)).toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).toBeInTheDocument()

  expect(getByText(new RegExp(copyrightText))).toBeInTheDocument()
})

it('should configure the footer', async () => {
  const copyrightText = faker.lorem.paragraph()
  const event = fakeEvent({
    template: fakeSimpleBlog({
      footer: {
        background: '#000000',
        textColor: '#FFFFFF',
        termsLink: null,
        privacyLink: null,
        copyrightText: null,
      },
    }),
  })

  const {findByLabelText} = render(
    <StaticEventProvider event={event}>
      <Dashboard isEditMode={true} user={fakeUser()} />
    </StaticEventProvider>,
  )

  clickEdit(await findByLabelText('footer'))

  fireEvent.change(await findByLabelText('set copyright text'), {
    target: {
      value: copyrightText,
    },
  })

  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findByLabelText('copyright')).textContent).toBe(copyrightText)

  // Saved
  await wait(
    () => {
      expect(mockPost).toHaveBeenCalledTimes(1)
    },
    {
      timeout: 20000,
    },
  )

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.footer.copyrightText).toBe(copyrightText)
})
