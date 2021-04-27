import React, {useEffect} from 'react'
import SimpleBlogSpeakers from 'Event/template/SimpleBlog/Speakers'
import {User} from 'auth/user'
import DashboardEditDialog from 'Event/Dashboard/editor/views/DashboardEditDialog'
import ConfigBar from 'Event/Dashboard/editor/views/ConfigBar'
import TemplateProviderSpeakers from 'Event/Speakers/state/TemplateProvider'
import TemplateProvider from 'Event/Dashboard/state/TemplateProvider'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'Event/Dashboard/editor/state/actions'
import {useEvent} from 'Event/EventProvider'

export type SpeakersProps = {
  isEditMode?: boolean
  user: User
}

export default function Speakers(props: SpeakersProps) {
  const dispatch = useDispatch()
  const {event} = useEvent()

  useEffect(() => {
    dispatch(setEditMode(props.isEditMode || false))
  }, [props.isEditMode, dispatch])

  return (
    <TemplateProvider template={event.template}>
      <TemplateProviderSpeakers
        template={{
          speakers: event.speaker_page ? event.speaker_page.speakers : [],
          title: event.speaker_page ? event.speaker_page.title : '',
        }}
      >
        <ConfigComponents isEditMode={props.isEditMode}>
          <TemplateSpeakers user={props.user} />
        </ConfigComponents>
      </TemplateProviderSpeakers>
    </TemplateProvider>
  )
}

function ConfigComponents(props: {
  isEditMode?: boolean
  children: React.ReactElement
}) {
  if (props.isEditMode) {
    return (
      <>
        <ConfigBar title="Configure Speakers" />
        {props.children}
        <DashboardEditDialog />
      </>
    )
  }

  return props.children
}

function TemplateSpeakers(props: {user: User}) {
  return <SimpleBlogSpeakers user={props.user} />
}
