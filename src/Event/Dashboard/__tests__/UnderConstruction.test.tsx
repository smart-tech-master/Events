import App from 'App'
import {fakeEvent} from 'Event/__utils__/factory'
import {visitEventSite} from 'Event/__utils__/url'
import React from 'react'
import {render} from '__utils__/render'

it('should should show under construction page', async () => {
  const missingWaiverConfig = fakeEvent({waiver: null})
  visitEventSite({event: missingWaiverConfig})

  const {findByText} = render(<App />)

  expect(await findByText('Under Construction')).toBeInTheDocument()
})
