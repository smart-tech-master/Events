import React from 'react'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useOrganization} from 'organization/OrganizationProvider'
import {useOrganizationAuth} from 'organization/auth'

export default function AppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {logout} = useOrganizationAuth()
  const history = useHistory()
  const {routes, organization} = useOrganization()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    logout()
    history.push(routes.login)
  }

  return (
    <MuiAppBar>
      <Toolbar>
        <HomeLink to={routes.events.root} disableStyles>
          {organization.name}
        </HomeLink>
        <div>
          <IconButton aria-haspopup="true" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <MenuItem onClick={handleClose}>
              <RelativeLink to={routes.events.root} disableStyles>
                Events
              </RelativeLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <RelativeLink to={routes.team} disableStyles>
                Team
              </RelativeLink>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </MuiAppBar>
  )
}

const HomeLink = styled(RelativeLink)`
  flex: 1;
`
