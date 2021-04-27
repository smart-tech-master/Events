import Button from '@material-ui/core/Button'
import {
  RESOURCE_ICON,
  RESOURCE_ITEM,
} from 'Event/Dashboard/components/ResourceList'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import React from 'react'
import {useDispatch} from 'react-redux'

export default function AddResourceButton(props: {className?: string}) {
  const updateTemplate = useUpdateTemplate()
  const {resourceList: list} = useTemplate()
  const dispatch = useDispatch()

  const addResource = () => {
    const resources = [
      ...list.resources,
      {
        name: 'Resource',
        filePath: '',
        icon: RESOURCE_ICON.pdf,
      },
    ]
    updateTemplate({
      resourceList: {
        ...list,
        resources,
      },
    })

    const lastItem = resources.length - 1
    dispatch(setConfig({type: RESOURCE_ITEM, id: lastItem}))
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add resource"
      onClick={addResource}
      className={props.className}
    >
      Add Resource
    </Button>
  )
}
