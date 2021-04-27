import React, {useEffect, useState} from 'react'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {Attendee} from 'Event/attendee'

export interface AttendeeImportResult {
  attendees: Attendee[]
  invalid_emails: string[]
}

export interface AttendeeImportProps {
  onSuccess: (attendees: Attendee[]) => void
  onError: (message: string) => void
  button: (inputId: string, submitting: boolean) => React.ReactElement
  successAlert: (numImported: number, onClose: () => void) => React.ReactElement
}

export default function AttendeeImport(props: AttendeeImportProps) {
  const [file, setFile] = useState<null | File>(null)
  const importFile = useImportFile()
  const {onSuccess, onError} = props
  const inputId = 'attendee-import-input'
  const [submitting, setSubmitting] = useState(false)
  const [numImported, setNumImported] = useState<number | null>(null)

  const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files ? evt.target.files[0] : null
    setFile(file)
  }

  useEffect(() => {
    if (!file || submitting) {
      return
    }

    setSubmitting(true)
    setNumImported(null)

    importFile(file)
      .then((res) => {
        onSuccess(res.attendees)
        setNumImported(res.attendees.length)

        const hasInvalidEmails = res.invalid_emails.length > 0
        if (hasInvalidEmails) {
          const emails = res.invalid_emails.join(', ')
          const invalidEmailMessage = `Could not import the following emails: ${emails}.`
          onError(invalidEmailMessage)
        }
      })
      .catch((e) => {
        onError(e.message)
      })
      .finally(() => {
        setFile(null)
        setSubmitting(false)
      })
  }, [file, importFile, onSuccess, onError, submitting])

  return (
    <>
      {props.button(inputId, submitting)}
      <input
        id={inputId}
        type="file"
        onChange={handleFileSelect}
        hidden
        required
        aria-label="attendee import input"
      />
      <SuccessAlert
        alert={props.successAlert}
        numImported={numImported}
        onClose={() => setNumImported(null)}
      />
    </>
  )
}

function SuccessAlert(props: {
  alert: AttendeeImportProps['successAlert']
  numImported: number | null
  onClose: () => void
}) {
  if (props.numImported === null) {
    return null
  }

  return props.alert(props.numImported, props.onClose)
}

function useImportFile() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/attendees/import`)

  return (file: File) => {
    const formData = new FormData()

    formData.set('file', file)
    return client.post<AttendeeImportResult>(url, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  }
}
