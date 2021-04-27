import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {ValidationError} from 'lib/api-client'
import {spacing} from 'lib/ui/theme'
import {api} from 'lib/url'
import {
  OrganizationClient,
  useOrganization,
} from 'organization/OrganizationProvider'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'
import {Organization} from 'organization'
import Page from 'organization/user/Layout/Page'
import {ObvioEvent} from 'Event'
import Layout from 'organization/user/Layout'

interface CreateEventData {
  name: string
  slug: string
}

export default function CreateEventForm() {
  const {register, errors, handleSubmit, watch} = useForm()
  const slug = watch('slug')
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<
    ValidationError<CreateEventData>
  >(null)
  const history = useHistory()
  const {routes, organization, client} = useOrganization()

  const goToEvents = () => {
    history.push(routes.events.root)
  }

  const submit = (data: CreateEventData) => {
    setSubmitting(true)
    createEvent(client, organization, data)
      .then(() => {
        goToEvents()
      })
      .catch((error) => {
        setServerError(error)
        setSubmitting(false)
      })
  }

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
      return 'Your event slug will be a part of your domain'
    }

    return `Your event will be accessible at: ${slug}.obv.io`
  }

  return (
    <Layout>
      <Page>
        <Title variant="h5" align="center">
          Create Your Event
        </Title>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            label="Event Name"
            name="name"
            required
            fullWidth
            variant="outlined"
            inputProps={{
              ref: register({
                required: 'Name is required',
              }),
              'aria-label': 'event name',
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
      </Page>
    </Layout>
  )
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

function createEvent(
  client: OrganizationClient,
  organization: Organization,
  data: CreateEventData,
) {
  const url = api(`/organizations/${organization.slug}/events`)
  return client.post<ObvioEvent>(url, data)
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
