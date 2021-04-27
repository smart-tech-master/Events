import React from 'react'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer'
import {User} from 'auth/user'

export default function Menu(props: {
  visible: boolean
  background: string
  toggle: () => void
  user: User
}) {
  return (
    <Drawer anchor="left" open={props.visible} onClose={props.toggle}>
      <Box background={props.background}>
        <UserInfo email={props.user.email} />
        <Links />
      </Box>
    </Drawer>
  )
}

function UserInfo(props: {email: string}) {
  return (
    <UserInfoText>
      You're logged in as <br />
      {props.email}
    </UserInfoText>
  )
}

function Links() {
  return (
    <List>
      <ListItem>
        <Link href="/change-password">Change password</Link>
      </ListItem>
      <ListItem>
        <Link href="/logout">Logout</Link>
      </ListItem>
    </List>
  )
}

const Box = styled.div<{background: string}>`
  background: ${(props) => props.background};
  height: 100%;
  min-width: 240px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${(props) =>
    `${props.theme.spacing[20]} ${props.theme.spacing[4]} ${props.theme.spacing[6]}`};
  color: #ffffff;
`

const UserInfoText = styled.p`
  text-align: center;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
`

const ListItem = styled.li`
  margin: ${(props) => props.theme.spacing[2]} 0;
`

const Link = styled.a`
  text-decoration: none;
  color: #ffffff;

  &:hover {
    text-decoration: underline;
  }
`
