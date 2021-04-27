import App, {appRoot} from 'App'
import React from 'react'
import {render} from '__utils__/render'
import axios from 'axios'

const mockGet = axios.get as jest.Mock

it('should return 404', async () => {
  const event = 'someevent'

  Object.defineProperty(window, 'location', {
    value: {
      host: `${event}.${appRoot}`,
    },
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: null}))

  const {findByText} = render(<App />)

  expect(await findByText(/404/i)).toBeInTheDocument()
  expect(mockGet).toHaveBeenCalledTimes(1)
  expect(mockGet.mock.calls[0][0]).toBe(`http://localhost:8000/events/${event}`)
})
