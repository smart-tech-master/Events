import React from 'react'
import {useAttendee} from 'Event/auth'
import Speakers from 'Event/Speakers'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'

export default function SpeakersPage() {
  const attendee = useAttendee()
  return (
    <AttendeeProfileProvider groups={attendee.groups} tags={attendee.tags}>
      <Speakers user={attendee} />
    </AttendeeProfileProvider>
  )
}
