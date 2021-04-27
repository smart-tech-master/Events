import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import React from 'react'

export default function EditModeOnly(props: {children: React.ReactNode}) {
  const isEditMode = useEditMode()
  if (!isEditMode) {
    return null
  }

  return <>{props.children}</>
}
