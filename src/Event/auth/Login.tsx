import Centered from 'lib/ui/layout/Centered'
import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import {useForm} from 'react-hook-form'
import {useEventAuth} from 'Event/auth'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {useSearchParams} from 'lib/url'

export default function Login() {
  const {event} = useEvent()
  const {token} = useSearchParams()
  const {register, handleSubmit, errors} = useForm()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {login} = useEventAuth()
  const hasAttemptedTokenLogin = useRef(false)

  const submit = (data: {email: string; password: string}) => {
    setSubmitting(true)
    login({
      email: data.email,
      password: data.password,
    }).catch((e) => {
      setError(e.message)
      setSubmitting(false)
    })
  }

  useEffect(() => {
    if (!token || hasAttemptedTokenLogin.current) {
      return
    }

    hasAttemptedTokenLogin.current = true
    setSubmitting(true)
    login({
      login_token: token,
    }).catch((e) => {
      setError(e.message)
      setSubmitting(false)
    })
  }, [token, login])

  return (
    <Centered>
      <Container>
        <EventName variant="h5">{event.name}</EventName>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
            disabled={submitting}
            inputProps={{
              ref: register({
                required: 'Email is required',
              }),
              'aria-label': 'email',
            }}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            name="password"
            disabled={submitting}
            inputProps={{
              ref: register({
                required: 'Password is required',
              }),
              'aria-label': 'password',
            }}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
          />
          <ErrorMessage>{error}</ErrorMessage>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            disabled={submitting}
            aria-label="submit login"
            type="submit"
          >
            Login
          </Button>
        </form>
      </Container>
    </Centered>
  )
}

const Container = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.spacing[4]};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 600px;
  }
`
const EventName = withStyles({
  root: {
    textAlign: 'center',
    marginBottom: spacing[3],
  },
})(Typography)

function ErrorMessage(props: {children: string}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const ErrorText = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`
