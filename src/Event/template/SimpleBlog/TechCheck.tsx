import React from 'react'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Container from '@material-ui/core/Container'
import {User} from 'auth/user'
import {TechCheckProps} from 'Event/Step3/TechCheck'
import styled from 'styled-components'
import grey from '@material-ui/core/colors/grey'
import {Button} from '@material-ui/core'

export default (props: {user: User} & TechCheckProps) => {
  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="sm">
        <Body
          dangerouslySetInnerHTML={{
            __html: props.techCheck.body,
          }}
        />
        <div>
          <Button
            variant="contained"
            color="primary"
            aria-label="start tech check"
            fullWidth
          >
            Start Tech Check
          </Button>
        </div>
      </Container>
    </SimpleBlogPage>
  )
}

const Body = styled.div`
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid ${grey[300]};
  padding: 0 ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
