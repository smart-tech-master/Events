import React from 'react'
import AgendaList from 'Event/Dashboard/components/AgendaList'
import EmojiList from 'Event/Dashboard/components/EmojiList'
import PointsSummary from 'Event/Dashboard/components/PointsSummary'
import {ResourceList} from 'Event/Dashboard/components/ResourceList'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import TicketRibbonList from 'Event/Dashboard/components/TicketRibbonList'
import SidebarNav from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import SidebarContainer from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'

export default function Sidebar() {
  const {sidebar} = useTemplate()

  return (
    <SidebarContainer
      background={sidebar.background}
      textColor={sidebar.textColor}
    >
      <EmojiList />
      <TicketRibbonList />
      <Section>
        <AgendaList />
      </Section>
      <Section>
        <PointsSummary />
      </Section>
      <Section>
        <ResourceList />
      </Section>
      <Section>
        <SidebarNav />
      </Section>
    </SidebarContainer>
  )
}
