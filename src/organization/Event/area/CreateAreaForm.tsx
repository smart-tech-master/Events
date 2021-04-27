import React from 'react'
import {useEvent} from 'Event/EventProvider'
import {ValidationError} from 'lib/api-client'
import {api} from 'lib/url'
import {Area} from 'organization/Event/area/AreaList'
import {useOrganization} from 'organization/OrganizationProvider'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import Layout from 'organization/user/Layout'
import Page from 'organization/user/Layout/Page'
import {withStyles} from '@material-ui/core'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import {fieldError} from 'lib/form'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useHistory} from 'react-router-dom'
import {areaRoutes} from 'organization/Event/area/AreaRoutes'

interface CreateAreaData {
  name: string
  requires_approval: boolean
  allows_multiple_devices: boolean
}

export default function CreateAreaForm() {
  const {register, errors, handleSubmit} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<
    ValidationError<CreateAreaData>
  >(null)
  const history = useHistory()
  const createArea = useCreateArea()
  const eventRoutes = useEventRoutes()
  const goToArea = (area: Area) => {
    history.push(areaRoutes({area, eventRoutes}).root)
  }

  const submit = (data: CreateAreaData) => {
    setSubmitting(true)
    createArea(data)
      .then(goToArea)
      .catch((e) => {
        setServerError(e)
        setSubmitting(false)
      })
  }

  return (
    <Layout>
      <Page>
        <Title variant="h5" align="center">
          Create Area
        </Title>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            label="Area Name"
            name="name"
            required
            fullWidth
            variant="outlined"
            inputProps={{
              ref: register({
                required: 'Name is required',
              }),
              'aria-label': 'area name input',
            }}
            error={fieldError('name', {form: errors, server: serverError})}
          />
          <FormControl required component="fieldset" fullWidth>
            <FormControlLabel
              inputRef={register}
              name="requires_approval"
              aria-label="toggle requires approval to join meeting"
              control={<Checkbox defaultChecked={true} />}
              label="Requires approval to join area meetings?"
            />
          </FormControl>
          <FormControl required component="fieldset" fullWidth>
            <FormControlLabel
              inputRef={register}
              name="allows_multiple_devices"
              aria-label="toggle allows multiple devices"
              control={<Checkbox defaultChecked={false} />}
              label="Can the same user use multiple devices to join at the same time?"
            />
          </FormControl>
          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={submitting}
              type="submit"
              aria-label="create area"
            >
              Create
            </Button>
          </div>
        </form>
      </Page>
    </Layout>
  )
}

function useCreateArea() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/areas`)

  return (data: CreateAreaData) => client.post<Area>(url, data)
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)
