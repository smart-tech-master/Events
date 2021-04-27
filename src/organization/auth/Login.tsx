import Button from '@material-ui/core/Button/Button'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Centered from 'lib/ui/layout/Centered'
import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import {useOrganizationAuth} from 'organization/auth'
import {useOrganization} from 'organization/OrganizationProvider'
import withStyles from '@material-ui/core/styles/withStyles'
import {useForm} from 'react-hook-form'

export default function Login() {
  const {register, handleSubmit, errors} = useForm()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {organization} = useOrganization()
  const {login} = useOrganizationAuth()

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
        <OrganizationName variant="h5">{organization.name}</OrganizationName>
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

function ErrorMessage(props: {children: string}) {
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

const OrganizationName = withStyles({
  root: {
    textAlign: 'center',
    marginBottom: spacing[3],
  },
})(Typography)
