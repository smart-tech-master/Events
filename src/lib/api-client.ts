import axios from 'axios'
import {getToken as getAuthToken} from 'auth/token'

export type ResponseError = {
  message: string
}

export type ValidationError<T> = {
  message: string
  errors: Partial<T>
} | null

const defaultHeaders = {
  'content-type': 'application/json',
}

export type RequestOptions = {
  headers?: Record<string, string>
  tokenKey?: string
}

export const client = {
  get: <T>(url: string, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.get(url, config(options))),
  post: <T>(url: string, data: {}, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.post(url, data, config(options))),
  put: <T>(url: string, data: {}, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.put(url, data, config(options))),
  patch: <T>(url: string, data: {} = {}, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.patch(url, data, config(options))),
  delete: <T>(url: string, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.delete(url, config(options))),
}

function config({
  headers: customHeaders,
  tokenKey,
  ...otherOptions
}: RequestOptions = {}) {
  return {headers: headers(tokenKey, customHeaders), ...otherOptions}
}

function headers(
  tokenKey: RequestOptions['tokenKey'],
  custom: RequestOptions['headers'] = {},
) {
  const headers: {[property: string]: string} = {
    ...defaultHeaders,
    ...custom,
  }

  if (tokenKey) {
    const token = getAuthToken(tokenKey)
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function handleAxiosResult<T>(promise: Promise<{data: T}>) {
  try {
    const res = await promise
    return res.data
  } catch (error) {
    // Response object
    if (error.response) {
      throw error.response.data
    }

    // Text error
    throw new Error(error)
  }
}

export const jsonHeader = (token?: string | null) => {
  const header = {
    // Without correct Content-Type, rxjs will serialize objects into [object, object]
    'Content-Type': 'application/json',
  }

  if (!token) {
    return header
  }

  return {
    ...header,
    Authorization: `Bearer ${token}`,
  }
}

// Helper to create PUT request data for Laravel
export const put = (body: any) => ({
  ...body,
  _method: 'PUT',
})

export const post = (body: any) => ({
  ...body,
  _method: 'POST',
})
