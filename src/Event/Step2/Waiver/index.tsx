import {useEvent} from 'Event/EventProvider'
import {api, storage} from 'lib/url'
import React, {useState} from 'react'
import {useAttendee} from 'Event/auth'
import {Attendee} from 'Event/attendee'
import {setUser} from 'auth/actions'
import {useDispatch} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {eventRoutes} from 'Event/Routes'
import TemplateProvider, {
  useTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogWaiver from 'Event/template/SimpleBlog/Waiver'
import {WaiverConfig} from 'Event'

export interface WaiverProps {
  submit: () => void
  canSubmit: boolean
  agree: boolean
  setAgree: (agree: WaiverProps['agree']) => void
  signature: string | null
  setSignature: (val: WaiverProps['signature']) => void
  waiver: WaiverConfig
  agreeLabel: string
}

export default function Waiver() {
  const {event, client} = useEvent()
  const {waiver} = event
  const attendee = useAttendee()
  const [signature, setSignature] = useState<string | null>(null)
  const [agree, setAgree] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()

  const canSubmit = Boolean(signature) && Boolean(agree) && !submitting
  const alreadySigned = Boolean(attendee.waiver)
  const agreeLabel = `I ${attendee.first_name} ${attendee.last_name} hereby certify that I have read the forgoing and fully understand the meaning effect thereof, and intending to be legally bound, have signed it. *`

  if (!waiver) {
    throw new Error(`Missing event waiver`)
  }

  if (alreadySigned) {
    return <Redirect to={eventRoutes.root} />
  }

  const submit = () => {
    setSubmitting(true)
    const url = api(`/events/${event.slug}/waiver/sign`)
    client
      .post<Attendee>(url, {
        signature,
      })
      .then((attendee) => {
        dispatch(setUser(attendee))
      })
      .catch(() => {
        setSubmitting(false)
      })
  }

  return (
    <TemplateProvider template={event.template}>
      <TemplateWaiver
        agree={agree}
        submit={submit}
        canSubmit={canSubmit}
        setAgree={setAgree}
        signature={signature}
        setSignature={setSignature}
        waiver={waiver}
        agreeLabel={agreeLabel}
      />
    </TemplateProvider>
  )
}

function TemplateWaiver(props: WaiverProps) {
  const template = useTemplate()
  const user = useAttendee()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogWaiver user={user} {...props} />
    default:
      throw new Error(`Missing waiver for template: ${template.name}`)
  }
}

export const waiverLogoPath = (logo: string) =>
  storage(`/event/waiver/logo/${logo}`)
