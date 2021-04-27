import Card from 'obvio/Organizations/Collection/Card'
import styled from 'styled-components'
import {useUserOrganizations} from 'obvio/Organizations/UserOrganizationsProvider'
import React from 'react'
import Button from '@material-ui/core/Button'
import {obvioRoutes} from 'obvio/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function Collection() {
  const {organizations, loading} = useUserOrganizations()
  const empty = organizations.length === 0

  if (loading) {
    return null
  }

  if (empty) {
    return (
      <EmptyBox>
        <p>No organizations have been created</p>
        <RelativeLink to={obvioRoutes.organizations.create} disableStyles>
          <Button variant="outlined" color="primary">
            Create Organization
          </Button>
        </RelativeLink>
      </EmptyBox>
    )
  }

  return (
    <div>
      <Header>
        <RelativeLink to={obvioRoutes.organizations.create} disableStyles>
          <Button variant="contained" color="primary">
            Create
          </Button>
        </RelativeLink>
      </Header>
      {organizations.map((o) => (
        <Card key={o.id} organization={o} />
      ))}
    </div>
  )
}

const EmptyBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[8]};
  text-align: center;
`

const Header = styled.div`
  text-align: right;
  margin-bottom: ${(props) => props.theme.spacing[6]};
`
