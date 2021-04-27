import AddTicketRibbonButton from 'Event/Dashboard/components/TicketRibbonList/TicketRibbonConfig/AddTicketRibbonButton'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import TicketRibbonItem, {TicketRibbon} from './TicketRibbon'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'

export default () => {
  const {ticketRibbons} = useTemplate()

  return (
    <>
      <EditModeOnly>
        <StyledSetTicketRibbonButton />
      </EditModeOnly>
      <RibbonsContainer>
        {ticketRibbons &&
          ticketRibbons.map((ticketRibbon: TicketRibbon, index: number) => {
            return (
              <TicketRibbonItem
                ticketRibbon={ticketRibbon}
                key={index}
                index={index}
              />
            )
          })}
      </RibbonsContainer>
    </>
  )
}

const RibbonsContainer = styled.div``

const StyledSetTicketRibbonButton = styled(AddTicketRibbonButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
