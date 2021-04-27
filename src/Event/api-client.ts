import {client} from './../lib/api-client'
import {EVENT_TOKEN_KEY} from 'Event/auth'
import {RequestOptions} from 'lib/api-client'

const tokenKey = EVENT_TOKEN_KEY

export type EventClient = typeof client
export const eventClient: EventClient = {
  get: (url: string, options?: RequestOptions) =>
    client.get(url, {...options, tokenKey}),
  post: (url: string, data: {}, options?: RequestOptions) =>
    client.post(url, data, {...options, tokenKey}),
  put: (url: string, data: {}, options?: RequestOptions) =>
    client.put(url, data, {...options, tokenKey}),
  patch: (url: string, data: {} = {}, options?: RequestOptions) =>
    client.patch(url, data, {...options, tokenKey}),
  delete: (url: string, options?: RequestOptions) =>
    client.delete(url, {...options, tokenKey}),
}
