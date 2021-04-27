import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import MainNavButton from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton'
import NewMainNavButton from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/NewMainNavButton'
import React from 'react'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'

export default function MainNav() {
  const {mainNav: buttons} = useTemplate()

  return (
    <>
      {buttons.ids.map((id) => (
        <MainNavButton key={id} id={id} button={buttons.entities[id]} />
      ))}
      <EditModeOnly>
        <NewMainNavButton />
      </EditModeOnly>
    </>
  )
}
