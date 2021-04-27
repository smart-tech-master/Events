import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import React from 'react'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Signature from 'Event/Step2/Waiver/Signature'
import Button from '@material-ui/core/Button'
import {onChangeCheckedHandler} from 'lib/dom'
import {User} from 'auth/user'
import {WaiverProps} from 'Event/Step2/Waiver'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'

export default function SimpleBlogWaiver(props: {user: User} & WaiverProps) {
  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="sm">
        <Body
          dangerouslySetInnerHTML={{
            __html: props.waiver.body,
          }}
        />
        <FormControl required component="fieldset">
          <FormControlLabel
            control={
              <Checkbox
                checked={props.agree}
                onChange={onChangeCheckedHandler(props.setAgree)}
                inputProps={{
                  'aria-label': 'agree to waiver checkbox',
                }}
              />
            }
            label={props.agreeLabel}
          />
        </FormControl>
        <Signature value={props.signature} onUpdate={props.setSignature} />
        <div>
          <Button
            variant="contained"
            color="primary"
            disabled={!props.canSubmit}
            onClick={props.submit}
            aria-label="submit waiver button"
          >
            Submit
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
