import React from 'react'
import {useAsync} from 'lib/async'
import {render} from '@testing-library/react'

it('should return the data', async () => {
  const data = 'hello'

  const callback = () => Promise.resolve(data)

  const {findByText, rerender} = render(<MyComponent callback={callback} />)

  expect(await findByText('loading')).toBeInTheDocument()

  expect(await findByText(data)).toBeInTheDocument()

  const error = `Something went wrong`
  rerender(<MyComponent callback={() => Promise.reject(error)} />)

  expect(await findByText('loading')).toBeInTheDocument()
  expect(await findByText(error)).toBeInTheDocument()
})

function MyComponent(props: {callback: () => Promise<any>}) {
  const {loading, data, error} = useAsync(props.callback)

  if (loading) {
    return <div>loading</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return <div>{data}</div>
}
