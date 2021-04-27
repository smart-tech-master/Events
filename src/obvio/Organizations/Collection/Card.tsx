import styled from 'styled-components'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import {Organization} from 'organization'
import {createRoutesFor} from 'organization/OrganizationProvider'

export default function Card(props: {organization: Organization}) {
  const routes = createRoutesFor(props.organization)
  const url = routes.root
  const label = `view ${props.organization.name}`
  return (
    <Link to={url} disableStyles aria-label={label}>
      {props.organization.name}
      <URL variant="caption">{url}</URL>
    </Link>
  )
}

const Link = styled(AbsoluteLink)`
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing[5]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  border-radius: 6px;
  display: block;

  &:hover {
    background: ${grey[200]};
  }
`

const URL = withStyles({
  root: {
    display: 'block',
    marginTop: spacing[1],
  },
})(Typography)
