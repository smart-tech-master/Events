import React from 'react'
import ReactDOM from 'react-dom'
import 'normalize.css'
import App from 'App'
import StoreProvider from 'store/StoreProvider'
import Providers from 'Providers'

ReactDOM.render(
  <Providers storeProvider={StoreProvider}>
    <App />
  </Providers>,
  document.getElementById('root'),
)
