import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Area} from 'organization/Event/area/AreaList'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

type AreaContextProps = {
  area: Area
  update: <T extends keyof Area>(key: T) => (val: Area[T]) => void
  processing: boolean
}

const AreaContext = React.createContext<AreaContextProps | undefined>(undefined)

export function AreaProvider(props: {children: React.ReactElement}) {
  const {area: routeId} = useParams<{area: string}>()
  const id = parseInt(routeId)
  const [area, setArea] = useState<Area | null>(null)
  const {data: saved, loading, error} = useSavedArea(id)
  const {update, processing} = useUpdateArea(id, setArea)

  useEffect(() => {
    setArea(saved)
  }, [saved])

  if (error) {
    throw new Error(error.message)
  }

  if (loading || !area) {
    return <div>loading...</div>
  }

  return (
    <AreaContext.Provider value={{area, update, processing}}>
      {props.children}
    </AreaContext.Provider>
  )
}

function useSavedArea(id: number) {
  const {client} = useOrganization()
  const {event} = useEvent()

  const fetch = useCallback(() => {
    const url = api(`/events/${event.slug}/areas/${id}`)
    return client.get<Area>(url)
  }, [id, client, event])

  return useAsync(fetch)
}

function useUpdateArea(id: number, setArea: (area: Area) => void) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const [processing, setProcessing] = useState(false)

  const update = useCallback(
    <T extends keyof Area>(key: T) => {
      const url = api(`/events/${event.slug}/areas/${id}`)
      return (value: Area[T]) => {
        setProcessing(true)
        client
          .patch<Area>(url, {[key]: value})
          .then(setArea)
          .finally(() => {
            setProcessing(false)
          })
      }
    },
    [id, client, event, setArea],
  )

  return {processing, update}
}

export function useArea() {
  const context = React.useContext(AreaContext)
  if (context === undefined) {
    throw new Error('useArea must be used within a AreaProvider')
  }

  return context
}
