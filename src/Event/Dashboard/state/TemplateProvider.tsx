import {updateTemplte} from 'Event/state/actions'
import {Template} from 'Event/template'
import React from 'react'
import {useDispatch} from 'react-redux'

const TemplateContext = React.createContext<Template | undefined>(undefined)

export default function TemplateProvider(props: {
  children: React.ReactNode
  template: Template | null
}) {
  if (!props.template) {
    throw new Error(`Template has not been set for event`)
  }
  return (
    <TemplateContext.Provider value={props.template}>
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

export function useUpdateTemplate() {
  const dispatch = useDispatch()

  return (updates: Partial<Template>) => {
    dispatch(updateTemplte(updates))
  }
}
