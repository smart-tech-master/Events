import {isProduction, isStaging} from 'App'
import {ExtendRecursively} from 'lib/type-utils'
import {useLocation} from 'react-router-dom'

export const getSubdomain = (location: string) => {
  const urlParts = location.split('.')
  const missingSubdomain = urlParts.length < 3
  if (missingSubdomain) {
    return ''
  }

  const hasNestedSubdomains = urlParts.length > 3
  if (!hasNestedSubdomains) {
    return urlParts[0]
  }

  const index = urlParts.length - 3
  const firstSubdomain = urlParts[index]
  const isStaging = firstSubdomain === 'staging'
  if (isStaging) {
    // return next child to allow app.staging.obv.io
    return urlParts[index - 1]
  }

  return firstSubdomain
}

export const api = (path: string) => {
  const baseUrl = process.env.REACT_APP_API_URL
  return `${baseUrl}${path}`
}

/**
 * Storage path for public assets store on the server
 *
 * @param path
 */
export const storage = (path: string) => {
  const local = `${process.env.REACT_APP_API_URL}/storage`
  const prodBucket = 'https://obvio-platform-public.s3.us-east-2.amazonaws.com'
  const stagingBucket =
    'https://obvio-platform-public-staging.s3.us-east-2.amazonaws.com'

  if (!isProduction) {
    return `${local}${path}`
  }

  const bucket = isStaging ? stagingBucket : prodBucket
  return `${bucket}${path}`
}

type Routes = {
  [key: string]: string | Routes
}

/**
 * Public path for frontend assets
 * Reference: https://create-react-app.dev/docs/using-the-public-folder/
 *
 * @param path
 */
export function publicAsset(path: string) {
  return `${process.env.PUBLIC_URL}${path}`
}

/**
 * Helper that automatically converts a JSON object
 * into route URLs with prependended parent
 * namespaces.
 *
 * @param routes
 * @param namespace
 */
export function createRoutes<T extends Routes>(
  routes: T,
  namespace?: string,
): ExtendRecursively<T, {root: string}> {
  const childRoutes = Object.entries(routes).reduce((acc, [key, val]) => {
    if (typeof val === 'string') {
      const prependedVal = namespace ? `/${namespace}${val}` : val
      acc[key] = prependedVal
      return acc
    }

    const prependedKey = namespace ? `${namespace}/${key}` : key
    acc[key] = createRoutes(val, prependedKey)

    return acc
  }, {} as any)

  // append root
  childRoutes.root = namespace ? `/${namespace}` : '/'

  return childRoutes
}

export function routesWithValue<T>(param: string, value: string, routes: T): T {
  return Object.entries(routes).reduce((acc, [key, route]) => {
    if (typeof route === 'string') {
      const withParam = route.replace(param, value)
      acc[key] = withParam
      return acc
    }

    acc[key] = routesWithValue(param, value, route)
    return acc
  }, {} as any)
}

export function useSearchParams() {
  const {search} = useLocation()
  const params = new URLSearchParams(search)

  const result: Record<string, string | undefined> = {}

  for (const [key, val] of params.entries()) {
    result[key] = val
  }

  return result
}
