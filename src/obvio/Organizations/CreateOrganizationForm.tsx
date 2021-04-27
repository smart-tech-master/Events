import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {appRoot} from 'App'
import {ValidationError} from 'lib/api-client'
import {spacing} from 'lib/ui/theme'
import {api} from 'lib/url'
import {obvioClient} from 'obvio/obvio-client'
import {obvioRoutes} from 'obvio/Routes'
import {Organization} from 'organization'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

export interface Data {
  name: string
  slug: string
}

export function sendRequest(data: Data) {
  const url = api('/organizations')
  return obvioClient.post<Organization>(url, data)
}

export default function CreateOrganizationForm() {
  const {register, errors, handleSubmit, watch} = useForm()
  const [serverError, setServerError] = useState<ValidationError<Data>>(null)
  const history = useHistory()
  const [submitting, setSubmitting] = useState(false)
  const showOrganizations = () => {
    history.push(obvioRoutes.organizations.root)
  }

  const submit = (data: Data) => {
    setSubmitting(true)
    sendRequest(data)
      .then(() => {
        showOrganizations()
      })
      .catch((error) => {
        setServerError(error)
        setSubmitting(false)
      })
  }

  const slug = watch('slug')

  const nameError = () => {
    if (errors.name) {
      return errors.name.message
    }

    if (serverError?.errors.name) {
      return serverError.errors.name
    }
  }

  const slugError = () => {
    if (errors.slug) {
      return errors.slug.message
    }

    if (serverError?.errors.slug) {
      return serverError.errors.slug
    }
  }

  const slugHelperText = () => {
    const error = slugError()
    if (error) {
      return error
    }
    if (!slug) {
      return 'Your organization slug will be a part of your domain'
    }

    return `Your organization will be accessible at: ${appRoot}/organization/${slug}`
  }

  return (
    <div>
      <Title variant="h5" align="center">
        Create Your Organization
      </Title>
      <form onSubmit={handleSubmit(submit)}>
        <TextField
          label="Organization Name"
          name="name"
          required
          fullWidth
          variant="outlined"
          inputProps={{
            ref: register({
              required: 'Name is required',
            }),
            'aria-label': 'organization name',
          }}
          error={!!nameError()}
          helperText={nameError()}
          disabled={submitting}
        />
        <TextField
          label="Unique Slug"
          name="slug"
          required
          fullWidth
          variant="outlined"
          inputProps={{
            ref: register({
              required: 'Slug is required',
            }),
            'aria-label': 'domain slug',
          }}
          error={!!slugError()}
          helperText={slugHelperText()}
          disabled={submitting}
        />
        <Error>{serverError && serverError.message}</Error>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          size="large"
          disabled={submitting}
          aria-label="create"
        >
          Submit
        </Button>
      </form>
    </div>
  )
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
