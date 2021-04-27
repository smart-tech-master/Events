import {useOrganizationAuth} from 'organization/auth'
import Speakers from 'Event/Speakers'
import {useEvent} from 'Event/EventProvider'
import React from 'react'
import CreateTemplateForm from 'organization/Event/DashboardConfig/CreateDashboardForm'
import Layout from 'organization/user/Layout'
import CreateSpeakerPageForm from './CreateSpeakerPageForm'

export default function SpeakersConfig() {
  const {event} = useEvent()
  const {user} = useOrganizationAuth()

  if (!user) {
    throw new Error('Missing user')
  }

  if (!event.template) {
    return <CreateTemplateForm />
  }

  if (!event.speaker_page) {
    return <CreateSpeakerPageForm />
  }

  return (
    <Layout>
      <Speakers user={user} isEditMode={true} />
    </Layout>
  )
}
