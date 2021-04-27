import React from 'react'
import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useCallback} from 'react'
import Card from 'organization/Event/area/AreaList/Card'

export interface Area {
  id: number
  name: string
  is_open: boolean
  requires_approval: boolean
  allows_multiple_devices: boolean
  rooms: Room[]
}

export default function AreaList() {
  const fetchAreas = useFetchAreas()
  const {data: areas, loading} = useAsync(fetchAreas)

  if (loading || !areas) {
    return null
  }

  const isEmpty = areas.length === 0
  if (isEmpty) {
    return <div>You have not created any areas</div>
  }

  return (
    <div>
      {areas.map((a) => (
        <Card key={a.id} area={a} />
      ))}
    </div>
  )
}

function useFetchAreas() {
  const {client} = useOrganization()
  const {event} = useEvent()

  return useCallback(() => {
    const url = api(`/events/${event.slug}/areas`)
    return client.get<Area[]>(url)
  }, [client, event])
}
