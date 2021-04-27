import faker from 'faker'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fireEvent} from '@testing-library/react'
import {goToAttendeeList} from 'organization/Event/AttendeeList/__utils__/attendee-list'

const mockPost = axios.post as jest.Mock

it('should import attendees', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeAttendee,
  )

  const {findByLabelText, findByText} = await goToAttendeeList({attendees})

  const file = new File([], 'attendees.csv')
  const fileInput = await findByLabelText('attendee import input')
  Object.defineProperty(fileInput, 'files', {
    value: [file],
  })

  const newAttendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeAttendee,
  )

  const invalidEmails = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () => faker.internet.email(),
  )

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {attendees: newAttendees, invalid_emails: invalidEmails},
    }),
  )

  fireEvent.change(fileInput)

  // New attendees were added
  for (const attendee of newAttendees) {
    expect(await findByText(attendee.email)).toBeInTheDocument()
  }

  // Shows number of imported attendees
  expect((await findByText(/successfully imported/i)).textContent).toMatch(
    new RegExp(`${newAttendees.length}`),
  )

  // Shows invalid emails error
  const invalidEmailsEl = await findByText(
    /could not import the following emails/i,
  )
  const invalidEmailsMessage = invalidEmailsEl.textContent

  for (const email of invalidEmails) {
    expect(invalidEmailsMessage).toMatch(new RegExp(email))
  }
})

it('it should update an existing attendee', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeAttendee,
  )

  const targetIndex = faker.random.number({min: 0, max: attendees.length - 1})
  const {findByLabelText, findAllByLabelText} = await goToAttendeeList({
    attendees,
  })

  const file = new File([], 'attendees.csv')
  const fileInput = await findByLabelText('attendee import input')
  Object.defineProperty(fileInput, 'files', {
    value: [file],
  })

  const newName = `${faker.name.firstName()}_new`
  const target = attendees[targetIndex]
  const updated = {
    ...target,
    first_name: newName,
  }
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {attendees: [updated], invalid_emails: []},
    }),
  )

  fireEvent.change(fileInput)

  // name was updated
  const name = (await findAllByLabelText('name'))[targetIndex].textContent
  expect(name).toMatch(new RegExp(newName))
})
