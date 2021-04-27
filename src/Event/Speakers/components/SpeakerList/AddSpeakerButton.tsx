import React from 'react'
import {Button} from '@material-ui/core'
import {
  useCreateSpeaker,
  useTemplate,
} from 'Event/Speakers/state/TemplateProvider'
import {useDispatch} from 'react-redux'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {SPEAKER} from '.'
import {Speaker} from 'Event'

export default function AddSpeakerButton(props: {className?: string}) {
  const speakerTemplate = useTemplate()

  let {speakers} = speakerTemplate
  if (!speakers) {
    throw new Error('Can not find speakers')
  }
  const createSpeaker = useCreateSpeaker()
  const dispatch = useDispatch()
  const {event} = useEvent()
  const {client} = useOrganization()

  const existingSpeakers = speakers || []

  const addSpeaker = () => {
    const speaker = {
      image: '',
      image_url: '',
      name: 'Speaker',
      text: '<p></p>',
    }

    const url = api(`/events/${event.slug}/speaker_page/speaker`)

    client.post<Speaker>(url, speaker).then((response: Speaker) => {
      createSpeaker(response)

      const lastItem = existingSpeakers.length - 1
      dispatch(setConfig({type: SPEAKER, id: lastItem}))
    })
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add speaker"
      onClick={addSpeaker}
      className={props.className}
    >
      Add Speaker
    </Button>
  )
}
