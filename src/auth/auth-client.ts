import {setLoading, setToken, setUser} from 'auth/actions'
import {deleteToken, getToken, saveToken} from 'auth/token'
import {User} from 'auth/user'
import {client} from 'lib/api-client'
import {api} from 'lib/url'
import {useOrganizationUrl} from 'organization/url'
import {useCallback, useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export interface AuthClientProps {
  tokenKey: string
  endpoints: {
    user: string
    login: string
    register: string
  }
}

interface TokenResponse {
  access_token: string
  expires_in: string
  token_type: string
}

export interface RegistrationData {
  email: string
  firstName: string
  lastName: string
  password: string
  passwordConfirmation: string
}

export const useAuthClient = (props: AuthClientProps) => {
  const {endpoints, tokenKey} = props
  const dispatch = useDispatch()
  const {user, loading} = useSelector((state: RootState) => state.auth)
  const isFetching = useRef(false)
  const {slug: organizationSlug} = useOrganizationUrl()

  useEffect(() => {
    const token = getToken(tokenKey)

    // No token, proceed as guest
    if (!token && loading) {
      dispatch(setLoading(false))
      return
    }

    // No need to try fetch authenticated user
    if (!token || !loading || isFetching.current) {
      return
    }

    isFetching.current = true
    fetchUser(tokenKey, endpoints.user)
      .then((user) => {
        dispatch(setUser(user))
        dispatch(setToken(token))
      })
      .catch(() => {
        // Token expired/invalid - do nothing, and force re-login
      })
      .finally(() => dispatch(setLoading(false)))
  }, [dispatch, loading, endpoints, tokenKey, organizationSlug])

  const login = useCallback(
    (credentials: LoginCredentials) => {
      return attemptLogin(endpoints.login, credentials)
        .then(({access_token: token}) => {
          saveToken(tokenKey, token)
          dispatch(setToken(token))
          return fetchUser(tokenKey, endpoints.user)
        })
        .then((user) => {
          dispatch(setUser(user))
        })
    },
    [dispatch, endpoints, tokenKey],
  )

  const register = useCallback(
    (data: RegistrationData) =>
      sendRegistrationRequest(endpoints.register, data)
        .then(({access_token: token}) => {
          saveToken(tokenKey, token)
          return fetchUser(tokenKey, endpoints.user)
        })
        .then((user) => dispatch(setUser(user))),
    [dispatch, endpoints, tokenKey],
  )

  const logout = useCallback(() => {
    deleteToken(tokenKey)
    dispatch(setUser(null))
    dispatch(setToken(null))
  }, [dispatch, tokenKey])

  return {
    user,
    loading,
    logout,
    login,
    register,
  }
}

async function fetchUser(
  tokenKey: string,
  endpoint: string,
): Promise<User | null> {
  const url = api(endpoint)
  return client.get<any>(url, {
    tokenKey,
  })
}

export type LoginCredentials = Record<string, string>

export const attemptLogin = (
  endpoint: string,
  credentials: Record<string, string>,
) => {
  const url = api(endpoint)
  return client.post<TokenResponse>(url, credentials)
}

function sendRegistrationRequest(endpoint: string, data: RegistrationData) {
  const url = api(endpoint)
  return client.post<TokenResponse>(url, {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    password: data.password,
    password_confirmation: data.passwordConfirmation,
  })
}
