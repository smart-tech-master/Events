import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeEvent, fakeTechCheck} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import faker from 'faker'

it('should show tech check page', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
  })

  const content = faker.lorem.paragraph()
  const body = `<p>${content}</p>`
  const event = fakeEvent({tech_check: fakeTechCheck({body})})

  const {findByLabelText, findByText} = await loginToEventSite({
    attendee,
    event,
  })

  expect(await findByLabelText('start tech check')).toBeInTheDocument()

  expect(await findByText(content)).toBeInTheDocument()
})

it('should show dashboard if completed tech check', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: faker.date.recent().toISOString(),
  })
  const {findByLabelText} = await loginToEventSite({attendee})

  // Has welcome text
  expect(await findByLabelText('welcome')).toBeInTheDocument()
})

it('should skip step 3 if disabled', async () => {
  const completedStep2 = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
  })

  const withTechCheckDisabled = fakeEvent({
    tech_check: fakeTechCheck({is_enabled: false}),
  })

  const {findByLabelText} = await loginToEventSite({
    attendee: completedStep2,
    event: withTechCheckDisabled,
  })

  // Has welcome text
  expect(await findByLabelText('welcome')).toBeInTheDocument()
})

it('should skip step 3 without config', async () => {
  const completedStep2 = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
  })

  const withoutTechCheckConfig = fakeEvent({
    tech_check: null,
  })

  const {findByLabelText} = await loginToEventSite({
    attendee: completedStep2,
    event: withoutTechCheckConfig,
  })

  // Has welcome text
  expect(await findByLabelText('welcome')).toBeInTheDocument()
})
