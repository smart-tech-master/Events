import FormControl from '@material-ui/core/FormControl'
import Icon from '@material-ui/core/Icon'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import {
  Resource,
  RESOURCE_ICON,
  RESOURCE_ITEM,
} from 'Event/Dashboard/components/ResourceList'
import {onUnknownChangeHandler, onChangeStringHandler} from 'lib/dom'
import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {useCallback} from 'react'
import ResourceUpload from './ResourceUpload'

export type ResourceItemConfig = {
  type: typeof RESOURCE_ITEM
  id: number
}

export function ResourceItemConfig(props: {id: ResourceItemConfig['id']}) {
  const {resourceList: list} = useTemplate()

  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()

  if (typeof props.id === 'undefined') {
    throw new Error('Missing component id')
  }

  const resource = list.resources[props.id]

  const update = useCallback(
    <T extends keyof Resource>(key: T) => (value: Resource[T]) => {
      const updated = {
        ...resource,
        [key]: value,
      }

      updateTemplate({
        resourceList: {
          ...list,
          resources: list.resources.map((r, index) => {
            const isTarget = index === props.id
            if (isTarget) {
              return updated
            }

            return r
          }),
        },
      })
    },
    [list, props.id, resource, updateTemplate],
  )

  const remove = () => {
    closeConfig()
    updateTemplate({
      resourceList: {
        ...list,
        resources: list.resources.filter((_, index) => index !== props.id),
      },
    })
  }

  return (
    <>
      <TextField
        value={resource.name}
        inputProps={{
          'aria-label': 'resource name',
        }}
        label="Name"
        fullWidth
        onChange={onChangeStringHandler(update('name'))}
      />
      <ResourceUpload resource={resource} update={update} />
      <FormControl fullWidth>
        <InputLabel>File Icon</InputLabel>
        <Select
          value={resource.icon}
          fullWidth
          onChange={onUnknownChangeHandler(update('icon'))}
          inputProps={{
            'aria-label': 'resource icon',
          }}
        >
          {Object.values(RESOURCE_ICON).map((icon) => (
            <MenuItem key={icon} value={icon}>
              <Icon component="i">{icon}</Icon>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <RemoveButton
        fullWidth
        variant="outlined"
        aria-label="remove resource"
        onClick={remove}
      >
        REMOVE RESOURCE
      </RemoveButton>
    </>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
