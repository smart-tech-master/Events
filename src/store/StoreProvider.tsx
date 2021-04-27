import React from 'react'
import {Provider} from 'react-redux'
import {createStore} from 'store'

export default function StoreProvider(props: {children: React.ReactNode}) {
  // Create a store each time to prevent tests from sharing the
  // same store
  const store = createStore()

  return <Provider store={store}>{props.children}</Provider>
}
