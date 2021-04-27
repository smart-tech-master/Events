import {withStyles} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {useAsync} from 'lib/async'
import {spacing} from 'lib/ui/theme'
import {api} from 'lib/url'
import Card from 'organization/Event/area/AreaConfig/RoomList/Card'
import {useArea} from 'organization/Event/area/AreaProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback} from 'react'

export default function RoomList() {
  const {rooms, loading} = useRooms()

  if (loading || !rooms) {
    return null
  }

  const isEmpty = rooms.length === 0
  if (isEmpty) {
    return (
      <div>
        <p>No rooms have been created</p>
      </div>
    )
  }

  return (
    <div>
      <Title variant="h6">Rooms</Title>
      {rooms.map((r) => (
        <Card key={r.id} room={r} />
      ))}
    </div>
  )
}

function useRooms() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()

  const {id} = area

  const fetch = useCallback(() => {
    const url = api(`/events/${event.slug}/areas/${id}/rooms`)
    return client.get<Room[]>(url)
  }, [client, event, id])

  const {data: rooms, ...asyncRes} = useAsync(fetch)

  return {rooms, ...asyncRes}
}

const Title = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
