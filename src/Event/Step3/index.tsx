import React from 'react'
import {useAttendee} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import {Redirect} from 'react-router-dom'
import TechCheck from 'Event/Step3/TechCheck'

export default () => {
  const attendee = useAttendee()

  if (!attendee.has_password) {
    return <Redirect to={eventRoutes.step1} />
  }

  if (!attendee.waiver) {
    return <Redirect to={eventRoutes.step2} />
  }

  const hasCompletedTechCheck = Boolean(attendee.tech_check_completed_at)
  if (hasCompletedTechCheck) {
    return <Redirect to={eventRoutes.root} />
  }

  return <TechCheck />
}
