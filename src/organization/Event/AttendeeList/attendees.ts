import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useCallback, useEffect, useState} from 'react'

export function useAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const {data: fetchedAttendees} = useFetchAttendees()

  useEffect(() => {
    if (!fetchedAttendees) {
      return
    }

    setAttendees(fetchedAttendees)
  }, [fetchedAttendees])

  const update = (target: Attendee) => {
    const updated = attendees.map((a) => {
      const isTarget = a.id === target.id
      if (isTarget) {
        return target
      }

      return a
    })

    setAttendees(updated)
  }

  const isExisting = (target: Attendee) =>
    !!attendees.find((existing) => target.id === existing.id)

  const insert = (items: Attendee[]) => {
    const updates = items.filter(isExisting)
    const newAttendees = items.filter((a) => !isExisting(a))

    const updatedExisting = attendees.map((existing) => {
      const updated = updates.find((a) => a.id === existing.id)
      if (!updated) {
        return existing
      }

      return updated
    })

    const updatedList = [...updatedExisting, ...newAttendees]
    setAttendees(updatedList)
  }

  return {
    attendees,
    update,
    insert,
  }
}

function useFetchAttendees() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/attendees`)

  const request = useCallback(() => client.get<Attendee[]>(url), [client, url])
  return useAsync(request)
}

export function useCheckIn() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee) => {
    const url = api(
      `/events/${event.slug}/attendees/${attendee.id}/complete_tech_check`,
    )

    return client.patch<Attendee>(url, {})
  }
}
