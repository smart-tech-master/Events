import {useAuthClient} from 'auth/auth-client'
import {User} from 'auth/user'
import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'

export const EVENT_TOKEN_KEY = `__obvio_event_user_token__`

export const useEventAuth = () => {
  const {event} = useEvent()
  const baseUrl = `/events/${event.slug}`

  return useAuthClient({
    tokenKey: EVENT_TOKEN_KEY,
    endpoints: {
      user: `${baseUrl}/user`,
      login: `${baseUrl}/login`,
      register: `/register`,
    },
  })
}

function isAttendee(user: User | null): user is Attendee {
  if (!user) {
    return false
  }

  return Object.prototype.hasOwnProperty.call(user, 'waiver')
}

export function useAttendee() {
  const {user} = useEventAuth()
  if (!user) {
    throw new Error(`Missing user; was useAttendee called in a guest route?`)
  }

  if (!isAttendee(user)) {
    throw new Error(`Invalid user; missing required attendee fields.`)
  }

  return user
}
