import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {routesWithValue} from 'lib/url'
import {Room} from 'Event/room'
import CreateRoomForm from 'organization/Event/area/room/CreateRoomForm'
import RoomConfig from 'organization/Event/area/room/RoomConfig'
import {RoomProvider} from 'organization/Event/area/room/RoomProvider'
import {useAreaRoutes} from 'organization/Event/area/AreaRoutes'

export function useRoomRoutes(room: Room) {
  const scopedAreaRoutes = useAreaRoutes()
  return roomRoutes({areaRoutes: scopedAreaRoutes, room})
}

export function roomRoutes({
  areaRoutes,
  room,
}: {
  areaRoutes: ReturnType<typeof useAreaRoutes>
  room: Room
}) {
  return routesWithValue(':room', String(room.id), areaRoutes.rooms[':room'])
}

export default function RoomRoutes() {
  const {routes} = useOrganization()

  return (
    <Switch>
      <Route path={routes.events[':event'].areas[':area'].rooms.create}>
        <CreateRoomForm />
      </Route>
      <Route path={routes.events[':event'].areas[':area'].rooms[':room'].root}>
        <RoomProvider>
          <RoomConfig />
        </RoomProvider>
      </Route>
      <Redirect to={routes.events[':event'].areas[':area'].rooms.create} />
    </Switch>
  )
}
