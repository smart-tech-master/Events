import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'Event/template/SimpleBlog/Styles'
import Container from '@material-ui/core/Container'
import Header from 'Event/template/SimpleBlog/Header'
import Menu from 'Event/template/SimpleBlog/Menu'
import {User} from 'auth/user'
import Footer from 'Event/template/SimpleBlog/Dashboard/Footer'
import {withStyles} from '@material-ui/core'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

export default function SimpleBlogPage(props: {
  user: User
  children: React.ReactElement | React.ReactElement[]
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const {primaryColor} = useTemplate()

  return (
    <Box>
      <SimpleBlogStyles primaryColor={primaryColor} />
      <Menu
        visible={menuVisible}
        background={primaryColor}
        toggle={toggleMenu}
        user={props.user}
      />
      <EditComponent component={{type: SIMPLE_BLOG}}>
        <Header
          primaryColor={primaryColor}
          menuVisible={menuVisible}
          toggleMenu={toggleMenu}
          aria-label="header"
        />
      </EditComponent>
      <Content>
        <StyledContainer maxWidth="lg">{props.children}</StyledContainer>
      </Content>
      <Footer />
    </Box>
  )
}

const Box = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;
  margin-bottom: 20px;
  display: flex;
`

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
})(Container)
