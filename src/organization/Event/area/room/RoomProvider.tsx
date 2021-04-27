import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useArea} from 'organization/Event/area/AreaProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

type UpdateRoom = (updates: Partial<Room>) => Promise<void>

type RoomContextProps = {
  room: Room
  update: UpdateRoom
  setOnline: (online: boolean) => void
  processing: boolean
}

const RoomContext = React.createContext<RoomContextProps | undefined>(undefined)

export function RoomProvider(props: {children: React.ReactElement}) {
  const {room: routeId} = useParams<{room: string}>()
  const id = parseInt(routeId)
  const [room, setRoom] = useState<Room | null>(null)
  const {data: saved, loading, error: fetchError} = useSavedRoom(id)
  const [processing, setProcessing] = useState(false)
  const update = useUpdateRoom(id, setRoom, setProcessing)
  const setOnline = useSetOnline(id, setRoom, setProcessing)

  useEffect(() => {
    setRoom(saved)
  }, [saved])

  if (loading || !room) {
    return null
  }

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  return (
    <RoomContext.Provider value={{room: room, update, processing, setOnline}}>
      {props.children}
    </RoomContext.Provider>
  )
}

function useSavedRoom(id: number) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()
  const {id: areaId} = area

  const fetch = useCallback(() => {
    const url = api(`/events/${event.slug}/areas/${areaId}/rooms/${id}`)
    return client.get<Room>(url)
  }, [id, client, event, areaId])

  return useAsync(fetch)
}

function useUpdateRoom(
  id: number,
  setRoom: (room: Room) => void,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()
  const {id: areaId} = area

  return useCallback<UpdateRoom>(
    (updates) => {
      const url = api(`/events/${event.slug}/areas/${areaId}/rooms/${id}`)
      setProcessing(true)
      return client
        .patch<Room>(url, updates)
        .then(setRoom)
        .finally(() => {
          setProcessing(false)
        })
    },
    [id, client, event, setRoom, areaId, setProcessing],
  )
}

function useSetOnline(
  id: number,
  setRoom: (room: Room) => void,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()

  return useCallback(
    (online: boolean) => {
      const endpoint = online
        ? `/events/${event.slug}/areas/${area.id}/rooms/${id}/start`
        : `/events/${event.slug}/areas/${area.id}/rooms/${id}/stop`
      const url = api(endpoint)

      setProcessing(true)
      client
        .patch<Room>(url)
        .then(setRoom)
        .finally(() => {
          setProcessing(false)
        })
    },
    [id, client, event, setRoom, area, setProcessing],
  )
}

export function useRoom() {
  const context = React.useContext(RoomContext)
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider')
  }

  return context
}
