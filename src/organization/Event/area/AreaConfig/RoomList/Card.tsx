import {Room} from 'Event/room'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import styled from 'styled-components'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import {useRoomRoutes} from 'organization/Event/area/RoomRoutes'

export default function Card(props: {room: Room}) {
  const label = `view ${props.room.name} room`
  const routes = useRoomRoutes(props.room)

  return (
    <RelativeLink to={routes.root} disableStyles aria-label={label}>
      <Box>{props.room.name}</Box>
    </RelativeLink>
  )
}

const Box = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing[5]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  border-radius: 6px;
  display: block;

  &:hover {
    background: ${grey[200]};
  }
`
