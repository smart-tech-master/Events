import Dialog from '@material-ui/core/Dialog'
import styled from 'styled-components'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from 'lib/ui/IconButton'
import grey from '@material-ui/core/colors/grey'
import {ComponentConfig} from 'Event/Dashboard/editor/views/DashboardEditDialog/ComponentConfig'

export default function DashboardEditDialog() {
  const component = useSelector((state: RootState) => state.editor.config)

  const dispatch = useDispatch()

  const dialogVisible = Boolean(component)

  const stopEdit = () => {
    dispatch(setConfig(null))
  }

  return (
    <Dialog open={dialogVisible} onClose={stopEdit} fullWidth>
      <CloseButton onClick={stopEdit} aria-label="close config dialog">
        <CloseIcon fontSize="small" />
      </CloseButton>
      <DialogTitle>{component?.type}</DialogTitle>
      <DialogContent>
        <ComponentConfig config={component} />
      </DialogContent>
    </Dialog>
  )
}

const CloseButton = styled(IconButton)`
  position: absolute;
  top: ${(props) => props.theme.spacing[2]};
  right: ${(props) => props.theme.spacing[2]};

  svg {
    color: ${grey[500]};
  }
`
