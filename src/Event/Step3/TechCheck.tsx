import React from 'react'
import TemplateProvider, {
  useTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {useAttendee} from 'Event/auth'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {TechCheckConfig} from 'Event'
import SimpleBlogTechCheck from 'Event/template/SimpleBlog/TechCheck'

export interface TechCheckProps {
  techCheck: TechCheckConfig
}

export default () => {
  const {event} = useEvent()
  const {tech_check: techCheck} = event

  if (!techCheck) {
    throw new Error(`Missing event tech check`)
  }

  return (
    <TemplateProvider template={event.template}>
      <TemplateTechCheck techCheck={techCheck} />
    </TemplateProvider>
  )
}

function TemplateTechCheck(props: TechCheckProps) {
  const template = useTemplate()
  const user = useAttendee()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogTechCheck user={user} {...props} />
    default:
      throw new Error(`Missing tech check for template: ${template.name}`)
  }
}
