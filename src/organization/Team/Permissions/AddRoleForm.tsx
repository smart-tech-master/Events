import {ValidationError} from 'lib/api-client'
import styled from 'styled-components'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {
  Role,
  usePermissions,
} from 'organization/Team/Permissions/PermissionsProvider'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import IfExists from 'lib/ui/layout/HasContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'

interface AddRoleData {
  name: string
}

export default function AddRoleForm() {
  const {register, handleSubmit, errors, reset: resetForm} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    ValidationError<AddRoleData>
  >(null)
  const {addRole} = usePermissions()
  const save = useSaveRole()

  const submit = (data: AddRoleData) => {
    setSubmitting(true)
    save(data)
      .then((role) => {
        addRole(role)
        resetForm()
        setResponseError(null)
      })
      .catch(setResponseError)
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <StyledForm onSubmit={handleSubmit(submit)}>
      <TextField
        label="Name"
        fullWidth
        variant="outlined"
        disabled={submitting}
        name="name"
        inputProps={{
          ref: register({
            required: 'Name is required',
          }),
          'aria-label': 'new role name',
        }}
        error={!!errors.name}
        helperText={errors.name && errors.name.message}
      />
      <IfExists Component={ErrorText} color="error">
        {responseError && responseError.message}
      </IfExists>
      <Button
        variant="outlined"
        type="submit"
        disabled={submitting}
        aria-label="add role"
      >
        Add
      </Button>
    </StyledForm>
  )
}

function useSaveRole() {
  const {organization, client} = useOrganization()
  const url = api(`/organizations/${organization.slug}/roles`)

  return (data: AddRoleData) => client.post<Role>(url, {name: data.name})
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

const StyledForm = styled.form`
  padding: ${(props) => props.theme.spacing[5]};
  border: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: ${(props) => props.theme.spacing[5]};
`
