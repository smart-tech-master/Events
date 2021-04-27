import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import {
  useTemplate,
  useUpdateSpeakerPageTitle,
} from 'Event/Speakers/state/TemplateProvider'
import {setEvent} from 'Event/state/actions'
import {SPEAKERS_TITLE} from 'Event/template/SimpleBlog/Speakers/MainTitle'
import {onChangeStringHandler} from 'lib/dom'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {debounce} from 'throttle-debounce'

export type SpeakersTitleConfig = {
  type: typeof SPEAKERS_TITLE
}

export function SpeakersTitleConfig() {
  const {title} = useTemplate()
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

  const updateSpeakerPageTitle = useUpdateSpeakerPageTitle()

  const update = (newVal: string) => {
    updateSpeakerPageTitle(newVal)
    setSpeakerPageTitle(newVal)
  }

  return (
    <TextField
      value={title}
      onChange={onChangeStringHandler(update)}
      fullWidth
      label="Text"
      inputProps={{
        'aria-label': 'edit speakers title',
      }}
    />
  )
}
