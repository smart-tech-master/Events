import {useEvent} from 'Event/EventProvider'
import React, {useState} from 'react'
import {api} from 'lib/url'
import {Attendee} from 'Event/attendee'
import {ValidationError} from 'lib/api-client'
import {setUser} from 'auth/actions'
import {useDispatch} from 'react-redux'
import TemplateProvider, {
  useTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {useAttendee} from 'Event/auth'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSetPasswordForm from 'Event/template/SimpleBlog/SetPasswordForm'

interface SetPasswordData {
  password: string
  password_confirmation: string
}

export interface SetPasswordFormProps {
  submit: (data: SetPasswordData) => void
  submitting: boolean
  responseError: ValidationError<SetPasswordData>
}

export default function SetPasswordForm() {
  const {event} = useEvent()
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    SetPasswordFormProps['responseError']
  >(null)
  const setPassword = useSetPassword()
  const dispatch = useDispatch()

  const submit = (data: SetPasswordData) => {
    setSubmitting(true)
    setPassword(data)
      .then((attendee) => {
        dispatch(setUser(attendee))
      })
      .catch((e) => {
        setResponseError(e)
        setSubmitting(false)
      })
  }

  return (
    <TemplateProvider template={event.template}>
      <TemplateSetPasswordForm
        submit={submit}
        submitting={submitting}
        responseError={responseError}
      />
    </TemplateProvider>
  )
}

function TemplateSetPasswordForm(props: SetPasswordFormProps) {
  const template = useTemplate()
  const user = useAttendee()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSetPasswordForm user={user} {...props} />
    default:
      throw new Error(
        `Missing set password form for template: ${template.name}`,
      )
  }
}

function useSetPassword() {
  const {event, client} = useEvent()
  const url = api(`/events/${event.slug}/password`)

  return (data: SetPasswordData) => client.post<Attendee>(url, data)
}
