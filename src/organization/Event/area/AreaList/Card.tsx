import {RelativeLink} from 'lib/ui/link/RelativeLink'
import styled from 'styled-components'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import {Area} from 'organization/Event/area/AreaList'
import {areaRoutes} from 'organization/Event/area/AreaRoutes'

export default function Card(props: {area: Area}) {
  const label = `view ${props.area.name} area`
  const eventRoutes = useEventRoutes()
  const routes = areaRoutes({area: props.area, eventRoutes})

  return (
    <RelativeLink to={routes.root} disableStyles aria-label={label}>
      <Box>{props.area.name}</Box>
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
