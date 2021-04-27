import {Speaker} from 'Event'
import {
  createSpeaker,
  removeSpeaker,
  updateSpeaker,
  updateSpeakerPageTitle,
} from 'Event/state/actions'
import React from 'react'
import {useDispatch} from 'react-redux'

export interface ConfigureSpeakerPageTemplate {
  title: string
  speakers: Speaker[] | null
}

const TemplateContext = React.createContext<
  ConfigureSpeakerPageTemplate | undefined
>(undefined)

export default function TemplateProvider(props: {
  children: React.ReactNode
  template: ConfigureSpeakerPageTemplate | null
}) {
  return (
    <TemplateContext.Provider value={props.template || undefined}>
      {props.children}
    </TemplateContext.Provider>
  )
}

export function useTemplate() {
  const context = React.useContext(TemplateContext)
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider')
  }

  return context
}

export function useUpdateSpeaker() {
  const dispatch = useDispatch()

  return (updates: Speaker) => {
    dispatch(updateSpeaker(updates))
  }
}

export function useCreateSpeaker() {
  const dispatch = useDispatch()

  return (updates: Speaker) => {
    dispatch(createSpeaker(updates))
  }
}

export function useRemoveSpeaker() {
  const dispatch = useDispatch()

  return (id: number) => {
    dispatch(removeSpeaker(id))
  }
}

export function useUpdateSpeakerPageTitle() {
  const dispatch = useDispatch()

  return (title: string) => {
    dispatch(updateSpeakerPageTitle(title))
  }
}
