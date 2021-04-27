import Centered from 'lib/ui/layout/Centered'
import styled from 'styled-components'
import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {useObvioAuth} from 'obvio/auth'
import Typography from '@material-ui/core/Typography'
import {obvioRoutes} from 'obvio/Routes'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import {useForm} from 'react-hook-form'
import {RegistrationData} from 'auth/auth-client'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function Registration() {
  const {register: registerForm, handleSubmit, errors, watch} = useForm()
  const [error, setError] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const {register} = useObvioAuth()

  const submit = (data: RegistrationData) => {
    setSubmitting(true)
    register(data).catch((e) => {
      setError(e.message)
      setSubmitting(false)
    })
  }

  return (
    <Centered>
      <Container>
        <form onSubmit={handleSubmit(submit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                variant="outlined"
                inputProps={{
                  ref: registerForm({
                    required: 'First name is required',
                  }),
                  'aria-label': 'first name',
                }}
                error={!!errors.firstName}
                helperText={errors.firstName && errors.firstName.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                variant="outlined"
                inputProps={{
                  ref: registerForm({
                    required: 'Last name is required',
                  }),
                  'aria-label': 'last name',
                }}
                error={!!errors.lastName}
                helperText={errors.lastName && errors.lastName.message}
              />
            </Grid>
          </Grid>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
            inputProps={{
              ref: registerForm({
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
            inputProps={{
              ref: registerForm({
                required: 'Password is required',
              }),
              'aria-label': 'password',
            }}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            name="passwordConfirmation"
            inputProps={{
              ref: registerForm({
                required: 'Password confirmation is required',
                validate: (value: any) =>
                  value === watch('password') || 'Passwords do not match',
              }),
              'aria-label': 'password confirmation',
            }}
            error={!!errors.passwordConfirmation}
            helperText={
              errors.passwordConfirmation && errors.passwordConfirmation.message
            }
          />
          <Error>{error}</Error>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            type="submit"
            disabled={submitting}
            aria-label="register"
          >
            Register
          </Button>
          <LoginText>
            Already have an account?{' '}
            <RelativeLink to={obvioRoutes.login}>Login instead</RelativeLink>
          </LoginText>
        </form>
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

const LoginText = withStyles({
  root: {
    marginTop: spacing[3],
  },
})(Typography)
