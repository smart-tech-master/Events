import React from 'react'
import {Provider} from 'react-redux'
import {createStore} from 'store'
import {AjaxCreationMethod} from 'rxjs/internal/observable/dom/AjaxObservable'
import {of} from 'rxjs'

// Mock rxjs ajax
export const mockRxJsAjax = ({
  get: jest.fn(() => of({message: 'ok'})),
  post: jest.fn(() => of({message: 'ok'})),
  put: jest.fn(() => of({message: 'ok'})),
  patch: jest.fn(() => of({message: 'ok'})),
  delete: jest.fn(() => of({message: 'ok'})),
  getJSON: jest.fn(() => of({message: 'ok'})),
} as unknown) as AjaxCreationMethod

export default function MockStoreProvider(props: {children: React.ReactNode}) {
  // Create a store each time to prevent tests from sharing the
  // same store
  const store = createStore({ajax: mockRxJsAjax})

  return <Provider store={store}>{props.children}</Provider>
}
