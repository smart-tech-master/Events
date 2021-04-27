import {useAttendee} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import React from 'react'
import {Redirect} from 'react-router-dom'
import Waiver from 'Event/Step2/Waiver'

export default function Step2() {
  const attendee = useAttendee()

  if (!attendee.has_password) {
    return <Redirect to={eventRoutes.step1} />
  }

  if (attendee.waiver) {
    return <Redirect to={eventRoutes.root} />
  }

  return <Waiver />
}
