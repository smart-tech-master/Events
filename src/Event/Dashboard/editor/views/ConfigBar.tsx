import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import Switch from '@material-ui/core/Switch'
import React from 'react'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'Event/Dashboard/editor/state/actions'
import {useEditMode, useIsSaving} from 'Event/Dashboard/editor/state/edit-mode'
import Typography from '@material-ui/core/Typography'
import CircularProgress, {
  CircularProgressProps,
} from '@material-ui/core/CircularProgress'
import grey from '@material-ui/core/colors/grey'
import green from '@material-ui/core/colors/green'
import yellow from '@material-ui/core/colors/yellow'

export default function ConfigBar({title = 'Configure Dashboard'}) {
  const isEditMode = useEditMode()
  const dispatch = useDispatch()

  const toggle = () => dispatch(setEditMode(!isEditMode))

  return (
    <Box>
      <Typography>{title}</Typography>
      <Right>
        <FormControlLabel
          control={
            <Switch checked={!isEditMode} onChange={toggle} color="primary" />
          }
          label="Preview"
        />
        <SavingIndicator />
      </Right>
    </Box>
  )
}

function SavingIndicator() {
  const isSaving = useIsSaving()
  const variant: CircularProgressProps['variant'] = isSaving
    ? 'indeterminate'
    : 'determinate'
  return (
    <ProgressSpinner
      size={18}
      thickness={6}
      value={100}
      variant={variant}
      active={isSaving}
    />
  )
}

const Box = styled.div`
  height: 50px;
  border-bottom: 1px solid ${grey[300]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${(props) => props.theme.spacing[4]};
`

const Right = styled.div`
  display: flex;
  align-items: center;
`

const ProgressSpinner = styled((props) => {
  const {active, ...otherProps} = props
  return <CircularProgress {...otherProps} />
})<{active: boolean}>`
  color: ${(props) => (props.active ? yellow[700] : green[400])} !important;
`
