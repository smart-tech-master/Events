import React from 'react'
import styled from 'styled-components'
import SidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav/SidebarNavButton'
import NewSidebarNavButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/NewSidebarNavButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'

export const SIDEBAR_NAV_BUTTON = 'Sidebar Nav Button'

export default function SidebarNav() {
  const {sidebarNav: buttons, primaryColor} = useTemplate()

  const hasButtons = buttons.ids.length > 0
  if (!hasButtons) {
    return null
  }

  return (
    <>
      {buttons.ids.map((id) => {
        const button = buttons.entities[id]
        return (
          <SidebarNavButton
            key={id}
            {...button}
            id={id}
            backgroundColor={primaryColor}
            hoverBackgroundColor={primaryColor}
          />
        )
      })}
      <EditModeOnly>
        <StyledNewSidebarNavButton />
      </EditModeOnly>
    </>
  )
}

const StyledNewSidebarNavButton = styled(NewSidebarNavButton)`
  margin-top: ${(props) => props.theme.spacing[6]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
