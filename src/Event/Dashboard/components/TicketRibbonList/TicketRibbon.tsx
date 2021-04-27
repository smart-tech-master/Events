import {useAttendeeProfile} from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import styled from 'styled-components'
import BLACK_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/black.png'
import BLUE_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/blue.png'
import BROWN_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/brown.png'
import GREEN_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/green.png'
import GREY_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/grey.png'
import ORANGE_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/orange.png'
import PURPLE_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/purple.png'
import RED_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/red.png'
import WHITE_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/white.png'
import YELLOW_RIBBON_IMAGE from 'Event/Dashboard/components/TicketRibbonList/ribbons/yellow.png'

export const TICKET_RIBBON = 'Ticket Ribbon'

export const BLACK_RIBBON = 'Black'
export const BLUE_RIBBON = 'Blue'
export const BROWN_RIBBON = 'Brown'
export const GREEN_RIBBON = 'Green'
export const GREY_RIBBON = 'Grey'
export const ORANGE_RIBBON = 'Orange'
export const PURPLE_RIBBON = 'Purple'
export const RED_RIBBON = 'Red'
export const WHITE_RIBBON = 'White'
export const YELLOW_RIBBON = 'Yellow'

export type TicketRibbonName =
  | typeof BLACK_RIBBON
  | typeof BLUE_RIBBON
  | typeof BROWN_RIBBON
  | typeof GREEN_RIBBON
  | typeof GREY_RIBBON
  | typeof ORANGE_RIBBON
  | typeof PURPLE_RIBBON
  | typeof RED_RIBBON
  | typeof WHITE_RIBBON
  | typeof YELLOW_RIBBON

export interface TicketRibbon {
  name: TicketRibbonName
  text: string
  color: string
  group_name: string
  group_value: string | number
}

export const TICKET_RIBBON_IMAGE: Record<TicketRibbonName, string> = {
  [BLACK_RIBBON]: BLACK_RIBBON_IMAGE,
  [BLUE_RIBBON]: BLUE_RIBBON_IMAGE,
  [BROWN_RIBBON]: BROWN_RIBBON_IMAGE,
  [GREEN_RIBBON]: GREEN_RIBBON_IMAGE,
  [GREY_RIBBON]: GREY_RIBBON_IMAGE,
  [ORANGE_RIBBON]: ORANGE_RIBBON_IMAGE,
  [PURPLE_RIBBON]: PURPLE_RIBBON_IMAGE,
  [RED_RIBBON]: RED_RIBBON_IMAGE,
  [WHITE_RIBBON]: WHITE_RIBBON_IMAGE,
  [YELLOW_RIBBON]: YELLOW_RIBBON_IMAGE,
}

export const RIBBONS = Object.keys(TICKET_RIBBON_IMAGE) as TicketRibbonName[]
export const IMAGES = Object.values(TICKET_RIBBON_IMAGE)

export default (props: {ticketRibbon: TicketRibbon; index: number}) => {
  const image = TICKET_RIBBON_IMAGE[props.ticketRibbon.name]

  return (
    <VisibleRibbon ticketRibbon={props.ticketRibbon}>
      <EditComponent component={{type: TICKET_RIBBON, index: props.index}}>
        <Box aria-label="ticket ribbon">
          <Ribbon background={`url(${image})`} color={props.ticketRibbon.color}>
            <RibbonText aria-label="ticket ribbon text">
              {props.ticketRibbon.text}
            </RibbonText>
          </Ribbon>
        </Box>
      </EditComponent>
    </VisibleRibbon>
  )
}

function VisibleRibbon(props: {
  ticketRibbon: TicketRibbon
  children: React.ReactElement
}) {
  const {belongsToGroup} = useAttendeeProfile()

  const isEditMode = useEditMode()
  if (isEditMode) {
    return props.children
  }

  const isTargetGroup = belongsToGroup(
    props.ticketRibbon.group_name,
    props.ticketRibbon.group_value,
  )
  if (!isTargetGroup) {
    return null
  }

  return props.children
}
const Box = styled.div`
  margin: ${(props) =>
    `-${props.theme.spacing[6]} 0 ${props.theme.spacing[8]}`};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    margin: ${(props) =>
      `-${props.theme.spacing[6]} -${props.theme.spacing[13]} ${props.theme.spacing[8]}`};
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    margin: ${(props) =>
      `-${props.theme.spacing[6]} -${props.theme.spacing[16]} ${props.theme.spacing[8]}`};
  }
`

const Ribbon = styled.div<{
  background: string
  color: string
}>`
  width: 100%;
  height: 70px;
  background: ${(props) => props.background};
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  color: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`

const RibbonText = styled.div`
  font-size: 35px;
  font-weight: bold;
`
