import TextField from '@material-ui/core/TextField'
import {
  ResourceList,
  RESOURCE_LIST,
} from 'Event/Dashboard/components/ResourceList'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'

export type ResourceListConfig = {
  type: typeof RESOURCE_LIST
}

export function ResourceListConfig() {
  const {resourceList: list} = useTemplate()
  const updateTemplate = useUpdateTemplate()

  const update = <T extends keyof ResourceList>(key: T) => (
    value: ResourceList[T],
  ) => {
    updateTemplate({
      resourceList: {
        ...list,
        [key]: value,
      },
    })
  }

  return (
    <>
      <TextField
        value={list.description}
        inputProps={{
          'aria-label': 'update resources description',
        }}
        label="Description"
        fullWidth
        onChange={onChangeStringHandler(update('description'))}
      />
    </>
  )
}
