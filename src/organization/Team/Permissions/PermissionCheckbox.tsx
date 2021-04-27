import Checkbox from '@material-ui/core/Checkbox'
import {ResponseError} from 'lib/api-client'
import {onChangeCheckedHandler} from 'lib/dom'
import {
  Permission,
  Role,
  useAddPermission,
  usePermissions,
  useRemovePermission,
} from 'organization/Team/Permissions/PermissionsProvider'
import React from 'react'

export default function PermissionCheckbox(props: {
  role: Role
  permission: Permission
  processing: boolean
  setProcessing: (processing: boolean) => void
  onError: (error: ResponseError) => void
}) {
  const {updateRole} = usePermissions()
  const hasPermission = props.role.permissions.includes(props.permission)

  const add = useAddPermission()
  const remove = useRemovePermission()

  const updatePermission = (isAdd: boolean) => {
    if (props.processing) {
      return
    }
    const update = isAdd ? add : remove

    props.setProcessing(true)
    update(props.role, props.permission)
      .then(updateRole)
      .catch(props.onError)
      .finally(() => {
        props.setProcessing(false)
      })
  }

  return (
    <Checkbox
      checked={hasPermission}
      onChange={onChangeCheckedHandler(updatePermission)}
      color="primary"
      inputProps={{
        'aria-label': 'toggle permission',
      }}
    />
  )
}
