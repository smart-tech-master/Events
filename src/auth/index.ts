import {
  AuthAction,
  handleSetLoading,
  handleSetToken,
  handleSetUser,
  SET_LOADING_ACTION,
  SET_TOKEN_ACTION,
  SET_USER_ACTION,
} from 'auth/actions'
import {User} from 'auth/user'
import {Attendee} from 'Event/attendee'

export interface AuthState {
  user: User | Attendee | null
  loading: boolean
  token: null | string
}

const defaultState: AuthState = {
  user: null,
  loading: true,
  token: null,
}

export function authReducer(
  state: AuthState = defaultState,
  action: AuthAction,
) {
  switch (action.type) {
    case SET_USER_ACTION:
      return handleSetUser(state, action)
    case SET_TOKEN_ACTION:
      return handleSetToken(state, action)
    case SET_LOADING_ACTION:
      return handleSetLoading(state, action)
    default: {
      return state
    }
  }
}
