import React from 'react'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import {useObvioAuth} from 'obvio/auth'
import {useHistory} from 'react-router-dom'
import {obvioRoutes} from 'obvio/Routes'
import logo from 'assets/images/logo.png'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function AppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {logout} = useObvioAuth()
  const history = useHistory()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    logout()
    history.push(obvioRoutes.login)
  }

  return (
    <MuiAppBar>
      <Toolbar>
        <Logo>
          <RelativeLink to={obvioRoutes.root} disableStyles>
            <img src={logo} alt="Obv.io" />
          </RelativeLink>
        </Logo>
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
          </Menu>
        </div>
      </Toolbar>
    </MuiAppBar>
  )
}

const Logo = styled.div`
  flex: 1;
  display: flex;

  a {
    width: 120px;
    img {
      max-width: 100%;
    }
  }
`
