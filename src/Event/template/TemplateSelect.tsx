import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {Template} from 'Event/template'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {onUnknownChangeHandler} from 'lib/dom'
import React from 'react'

export default function TemplateSelect(props: {
  value: Template['name'] | null
  onPick: (template: Template['name']) => void
}) {
  return (
    <FormControl fullWidth>
      <InputLabel>Event Template</InputLabel>
      <Select
        value={props.value || ''}
        fullWidth
        onChange={onUnknownChangeHandler(props.onPick)}
        inputProps={{
          'aria-label': 'dashboard select',
        }}
      >
        <MenuItem value={SIMPLE_BLOG}>{SIMPLE_BLOG}</MenuItem>
      </Select>
    </FormControl>
  )
}
