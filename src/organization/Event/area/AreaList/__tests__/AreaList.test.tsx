import React from 'react'
import faker from 'faker'
import {fakeArea} from 'organization/Event/area/AreaList/__utils__/factory'
import {goToEvent} from 'organization/Event/__utils__/event'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'

it('should render list of areas', async () => {
  const areas = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeArea,
  )

  const {event} = goToEvent({areas})

  const {findByText, findByLabelText} = render(<App />)

  user.click(await findByLabelText(`view ${event.name}`))

  for (const area of areas) {
    expect(await findByText(area.name)).toBeInTheDocument()
  }
})
