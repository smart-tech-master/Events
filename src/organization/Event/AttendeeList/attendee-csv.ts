import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import download from 'js-file-download'

export interface AttendeeExportResult {
  data: string
  file_name: string
}

export function useExportAttendees(options: {
  onError: (message: string) => void
}) {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/attendees/export `)

  return () =>
    client
      .get<AttendeeExportResult>(url)
      .then((res) => {
        download(res.data, res.file_name)
      })
      .catch((e) => options.onError(e.message))
}
