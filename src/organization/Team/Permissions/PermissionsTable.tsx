import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {
  Role,
  usePermissions,
} from 'organization/Team/Permissions/PermissionsProvider'
import React, {useEffect, useState} from 'react'
import PermissionCheckbox from 'organization/Team/Permissions/PermissionCheckbox'
import {ResponseError} from 'lib/api-client'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import DeleteIconButton from 'lib/ui/IconButton/DeleteIconButton'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'

export default function Permissions() {
  const {roles, permissions} = usePermissions()
  const [responseError, setResponseError] = useState<ResponseError | null>(null)
  const [processing, setProcessing] = useState(false)
  const removeFromServer = useRemoveRole()
  const {removeRole: removeRoleFromList} = usePermissions()

  useEffect(() => {
    if (!responseError) {
      return
    }

    const errorDurationMs = 3000
    const timer = setTimeout(() => {
      setResponseError(null)
    }, errorDurationMs)
    return () => {
      clearTimeout(timer)
    }
  }, [responseError])

  const removeRole = (role: Role) => {
    setProcessing(true)
    removeFromServer(role)
      .then(() => {
        removeRoleFromList(role)
      })
      .catch(setResponseError)
      .finally(() => {
        setProcessing(false)
      })
  }

  const hasRoles = roles.length > 0
  if (!hasRoles) {
    return <EmptyPlaceholder>No roles have been created</EmptyPlaceholder>
  }
  return (
    <TableContainer component={Paper}>
      <UpdateError>{responseError}</UpdateError>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Role</TableCell>
            {permissions.map((permission) => (
              <TableCell
                key={permission}
                align="center"
                aria-label="permission name"
              >
                {permission}
              </TableCell>
            ))}
            {/* Delete column */}
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.name}>
              <TableCell component="th" scope="row">
                {role.name}
              </TableCell>
              {permissions.map((permission) => (
                <TableCell key={permission} align="center">
                  <PermissionCheckbox
                    processing={processing}
                    setProcessing={setProcessing}
                    role={role}
                    permission={permission}
                    onError={setResponseError}
                  />
                </TableCell>
              ))}
              <TableCell>
                <DeleteIconButton
                  onClick={() => removeRole(role)}
                  aria-label="remove role"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function UpdateError(props: {children: ResponseError | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children.message}</ErrorText>
}

function useRemoveRole() {
  const {client, organization} = useOrganization()

  return (role: Role) => {
    const url = api(`/organizations/${organization.slug}/roles/${role.id}`)
    return client.delete<Role>(url)
  }
}

const EmptyPlaceholder = styled.p`
  text-align: center;
`

const ErrorText = withStyles({
  root: {
    paddingTop: spacing[4],
    paddingX: spacing[4],
    textAlign: 'center',
  },
})(Typography)
