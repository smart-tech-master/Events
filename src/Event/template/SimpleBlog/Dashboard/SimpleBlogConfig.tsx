import TextField from '@material-ui/core/TextField'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {SimpleBlog, SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {onChangeStringHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'

export type SimpleBlogConfig = {
  type: typeof SIMPLE_BLOG
}

export function SimpleBlogConfig() {
  const dashboard = useTemplate()
  const updateTemplate = useUpdateTemplate()

  const update = <T extends keyof SimpleBlog>(key: T) => (
    value: SimpleBlog[T],
  ) => {
    updateTemplate({
      [key]: value,
    })
  }

  return (
    <>
      <TextField
        value={dashboard.logo}
        label="Logo URL"
        fullWidth
        onChange={onChangeStringHandler(update('logo'))}
        inputProps={{
          'aria-label': 'edit logo',
        }}
      />
      <ColorPicker
        label="Primary Color"
        color={dashboard.primaryColor}
        onPick={update('primaryColor')}
      />
    </>
  )
}
