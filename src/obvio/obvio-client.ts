import {client, RequestOptions} from 'lib/api-client'
import {OBVIO_TOKEN_KEY} from 'obvio/auth'

export const obvioClient: typeof client = {
  get: (url: string, options?: RequestOptions) =>
    client.get(url, {...options, tokenKey: OBVIO_TOKEN_KEY}),
  post: (url: string, data: {}, options?: RequestOptions) =>
    client.post(url, data, {...options, tokenKey: OBVIO_TOKEN_KEY}),
  put: (url: string, data: {}, options?: RequestOptions) =>
    client.put(url, data, {...options, tokenKey: OBVIO_TOKEN_KEY}),
  patch: (url: string, data: {} = {}, options?: RequestOptions) =>
    client.patch(url, data, {...options, tokenKey: OBVIO_TOKEN_KEY}),
  delete: (url: string, options?: RequestOptions) =>
    client.delete(url, {...options, tokenKey: OBVIO_TOKEN_KEY}),
}
