import {Container} from '@material-ui/core'
import React from 'react'
import Typography from '@material-ui/core/Typography/'
import TextField from '@material-ui/core/TextField'
import {useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {User} from 'auth/user'
import {SetPasswordFormProps} from 'Event/Step1/SetPasswordForm'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'

export default function SimpleBlogSetPasswordForm(
  props: {user: User} & SetPasswordFormProps,
) {
  const {register, handleSubmit, errors, watch} = useForm()

  const password = watch('password')
  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="sm">
        <Typography align="center">
          Please set a password to continue
        </Typography>
        <form onSubmit={handleSubmit(props.submit)}>
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            name="password"
            inputProps={{
              ref: register({
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }),
              'aria-label': 'password input',
            }}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
            disabled={props.submitting}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            name="password_confirmation"
            inputProps={{
              ref: register({
                required: 'Confirm Password is required',
                validate: (value: any) =>
                  value === password || 'Passwords are not a match',
              }),
              'aria-label': 'confirm password input',
            }}
            error={!!errors.password_confirmation}
            helperText={
              errors.password_confirmation &&
              errors.password_confirmation.message
            }
            disabled={props.submitting}
          />
          <Error>{props.responseError && props.responseError.message}</Error>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            disabled={props.submitting}
            aria-label="submit set password form"
          >
            Submit
          </Button>
        </form>
      </Container>
    </SimpleBlogPage>
  )
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
