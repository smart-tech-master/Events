import Button from '@material-ui/core/Button'
import NavButton from 'Event/Dashboard/components/NavButton'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import React from 'react'
import {v4 as uid} from 'uuid'

export default function NewSidebarNavButton(props: {className?: string}) {
  const isEditMode = useEditMode()
  const {sidebarNav: buttons} = useTemplate()
  const updateTemplate = useUpdateTemplate()

  if (!isEditMode) {
    return null
  }

  const addButton = () => {
    const id = uid()
    const button: NavButton = {
      text: 'Button',
      link: '',
      rules: [],
    }
    const entities = {
      ...buttons.entities,
      [id]: button,
    }
    const ids = [...buttons.ids, id]

    updateTemplate({
      sidebarNav: {
        entities,
        ids,
      },
    })
  }
  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add sidebar nav button"
      onClick={addButton}
      className={props.className}
    >
      New Button
    </Button>
  )
}
