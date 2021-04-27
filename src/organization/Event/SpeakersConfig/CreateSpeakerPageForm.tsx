import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Page from 'organization/user/Layout/Page'
import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import {setEvent} from 'Event/state/actions'
import {debounce} from 'throttle-debounce'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'

type SpeakerPageData = {
  title: string
}

export default function CreateSpeakerPageForm() {
  const {register, handleSubmit} = useForm()
  const dispatch = useDispatch()
  const {event} = useEvent()
  const {client} = useOrganization()

  const setSpeakerPage = (title: string) => {
    const url = api(`/events/${event.slug}/speaker_page`)

    client.post(url, {title}).then((response: any) => {
      dispatch(setEvent(response))
    })
  }

  const setSpeakerPageTitle = useCallback(
    debounce(1000, false, (title: string) => setSpeakerPage(title)),
    [dispatch],
  )

  const submit = (data: SpeakerPageData) => {
    setSpeakerPageTitle(data.title)
  }

  return (
    <Page>
      <form onSubmit={handleSubmit(submit)}>
        <TextField
          name="title"
          label="Speaker Page Title"
          fullWidth
          inputProps={{
            ref: register,
            'aria-label': 'speaker page title',
            required: 'Title is required',
          }}
          helperText="Speaker Page Title"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          aria-label="save speaker page title"
          type="submit"
        >
          Save
        </Button>
      </form>
    </Page>
  )
}
