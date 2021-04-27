import React, {useEffect} from 'react'
import SimpleBlogDashboard from 'Event/template/SimpleBlog/Dashboard'
import {User} from 'auth/user'
import DashboardEditDialog from 'Event/Dashboard/editor/views/DashboardEditDialog'
import ConfigBar from 'Event/Dashboard/editor/views/ConfigBar'
import TemplateProvider, {
  useTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'Event/Dashboard/editor/state/actions'
import {useEvent} from 'Event/EventProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

export type DashboardProps = {
  isEditMode?: boolean
  user: User
}

export default function Dashboard(props: DashboardProps) {
  const dispatch = useDispatch()
  const {event} = useEvent()

  useEffect(() => {
    dispatch(setEditMode(props.isEditMode || false))
  }, [props.isEditMode, dispatch])

  return (
    <TemplateProvider template={event.template}>
      <ConfigComponents isEditMode={props.isEditMode}>
        <TemplateDashboard user={props.user} />
      </ConfigComponents>
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
        <ConfigBar />
        {props.children}
        <DashboardEditDialog />
      </>
    )
  }

  return props.children
}

function TemplateDashboard(props: {user: User}) {
  const template = useTemplate()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogDashboard user={props.user} />
    default:
      throw new Error(`Missing dashboard for template: ${template.name}`)
  }
}
