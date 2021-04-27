import {appRoot, isProduction} from 'App'
import {getSubdomain} from 'lib/url'
import {useParams} from 'react-router-dom'
import {ObvioEvent} from 'Event'

export function eventUrl(event: ObvioEvent) {
  const scheme = isProduction ? 'https://' : 'http://'
  return `${scheme}${event.slug}.${appRoot}`
}

export function domainEventSlug() {
  return getSubdomain(window.location.host)
}

export function useParamEventSlug() {
  const {event} = useParams<{event: string}>()
  return event
}
