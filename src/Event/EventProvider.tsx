import {client} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {domainEventSlug, useParamEventSlug} from 'Event/url'
import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {setEvent} from 'Event/state/actions'
import {ObvioEvent} from 'Event'
import {RootState} from 'store'
import {EventClient, eventClient} from 'Event/api-client'

interface EventContextProps {
  event: ObvioEvent
  client: EventClient
  hasTechCheck: boolean
}

export const EventContext = React.createContext<EventContextProps | undefined>(
  undefined,
)

export function DomainEventProvider(props: {children: React.ReactNode}) {
  const slug = domainEventSlug()
  return <EventProvider slug={slug} {...props} />
}

export function RouteEventProvider(props: {children: React.ReactNode}) {
  const slug = useParamEventSlug()
  return <EventProvider slug={slug} {...props} />
}

function EventProvider(props: {children: React.ReactNode; slug: string}) {
  const {slug} = props
  const find = useCallback(() => {
    return findEvent(slug)
  }, [slug])
  const dispatch = useDispatch()

  const {data: saved, loading} = useAsync(find)
  const current = useSelector((state: RootState) => state.event)

  useEffect(() => {
    if (!saved) {
      return
    }
    dispatch(setEvent(saved))
  }, [saved, dispatch])

  if (loading) {
    return <div>loading...</div>
  }

  if (!saved) {
    return (
      <div>
        <h1>404 - Event not found</h1>
      </div>
    )
  }

  if (!current) {
    return <div>loading...</div>
  }

  return (
    <EventContext.Provider
      value={{
        event: current,
        client: eventClient,
        hasTechCheck: hasTechCheck(current),
      }}
    >
      {props.children}
    </EventContext.Provider>
  )
}

export function useEvent() {
  const context = React.useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvent must be used within a EventProvider')
  }

  return context
}

function findEvent(slug: string) {
  const url = api(`/events/${slug}`)
  return client.get<ObvioEvent>(url)
}

export function hasTechCheck(event: ObvioEvent) {
  if (!event.tech_check) {
    return false
  }

  return event.tech_check.is_enabled
}
