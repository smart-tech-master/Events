import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import NavButton from 'Event/Dashboard/components/NavButton'
import {
  onChangeCheckedHandler,
  onChangeNumberHandler,
  onChangeStringHandler,
} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import React from 'react'
import Box from '@material-ui/core/Box'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {SIDEBAR_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'

export type SidebarNavButtonConfig = {
  type: typeof SIDEBAR_NAV_BUTTON
  id: string
}

export function SidebarNavButtonConfig(props: {
  id: SidebarNavButtonConfig['id']
}) {
  const {sidebarNav: buttons} = useTemplate()

  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()
  const {id} = props

  if (!id) {
    throw new Error('Missing component id')
  }

  const button = buttons.entities[id]

  const update = (updated: NavButton) => {
    updateTemplate({
      sidebarNav: {
        ...buttons,
        entities: {
          ...buttons.entities,
          [id]: updated,
        },
      },
    })
  }

  const removeButton = () => {
    const {[id]: target, ...otherButtons} = buttons.entities
    const updatedIds = buttons.ids.filter((i) => i !== id)

    closeConfig()
    updateTemplate({
      sidebarNav: {
        entities: otherButtons,
        ids: updatedIds,
      },
    })
  }

  const updateButton = <T extends keyof NavButton>(key: T) => (
    value: NavButton[T],
  ) =>
    update({
      ...button,
      [key]: value,
    })

  return (
    <>
      <TextField
        label="Text"
        value={button.text}
        inputProps={{
          'aria-label': 'button name input',
        }}
        fullWidth
        onChange={onChangeStringHandler(updateButton('text'))}
      />
      <TextField
        label="Link URL"
        value={button.link}
        inputProps={{
          'aria-label': 'button link input',
        }}
        fullWidth
        onChange={onChangeStringHandler(updateButton('link'))}
      />
      <FormControl>
        <FormControlLabel
          label="New Tab"
          control={
            <Checkbox
              checked={button.newTab || false}
              onChange={onChangeCheckedHandler(updateButton('newTab'))}
            />
          }
        />
      </FormControl>
      <TextField
        value={button.borderRadius || ''}
        label="Border Radius"
        type="number"
        fullWidth
        inputProps={{
          min: 0,
        }}
        onChange={onChangeNumberHandler(updateButton('borderRadius'))}
      />

      <Box mt={2} mb={3}>
        <DangerButton
          fullWidth
          variant="outlined"
          aria-label="remove button"
          onClick={removeButton}
        >
          REMOVE BUTTON
        </DangerButton>
      </Box>
    </>
  )
}
