import Button from '@material-ui/core/Button/Button'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Centered from 'lib/ui/layout/Centered'
import React, {useState} from 'react'
import {useObvioAuth} from 'obvio/auth'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {obvioRoutes} from 'obvio/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useForm} from 'react-hook-form'

export default function Login() {
  const {register, handleSubmit, errors} = useForm()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {login} = useObvioAuth()

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

  return (
    <Centered>
      <Container>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            disabled={submitting}
            name="email"
            inputProps={{
              ref: register({
                required: 'Email is required',
              }),
              'aria-label': 'obvio account email',
            }}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            disabled={submitting}
            name="password"
            inputProps={{
              ref: register({
                required: 'Password is required',
              }),
              'aria-label': 'obvio account password',
            }}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
          />
          <Error>{error}</Error>
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
        <CreateAccountText>
          Don't have an account yet?{' '}
          <RelativeLink
            to={obvioRoutes.registration}
            aria-label="create account"
          >
            Create one now
          </RelativeLink>
        </CreateAccountText>
      </Container>
    </Centered>
  )
}

function Error(props: {children: string}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const Container = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.spacing[4]};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 600px;
  }
`

const ErrorText = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const CreateAccountText = withStyles({
  root: {
    marginTop: spacing[3],
  },
})(Typography)
