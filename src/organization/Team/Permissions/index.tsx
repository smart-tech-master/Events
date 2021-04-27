import IfOwner from 'organization/auth/IfOwner'
import AddRoleForm from 'organization/Team/Permissions/AddRoleForm'
import PermissionsTable from 'organization/Team/Permissions/PermissionsTable'
import React from 'react'

export default function Permissions() {
  return (
    <>
      <IfOwner>
        <AddRoleForm />
      </IfOwner>
      <PermissionsTable />
    </>
  )
}
