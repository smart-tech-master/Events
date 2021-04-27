import {ButtonProps} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React from 'react'
import red from '@material-ui/core/colors/red'

export default function DangerButton(
  props: ButtonProps & {className?: string},
) {
  const isContained = props.variant === 'contained'

  const classes = makeStyles({
    root: {
      color: isContained ? '#FFFFFF' : red[500],
      borderColor: red[500],
      background: isContained ? red[500] : 'transparent',
      '&:hover': {
        backgroundColor: isContained ? red[700] : red[50],
      },
    },
  })()

  const classNames = props.className
    ? `${classes.root} ${props.className}`
    : classes.root

  return <Button {...props} className={classNames}></Button>
}
