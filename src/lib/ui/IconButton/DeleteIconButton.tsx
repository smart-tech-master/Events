import React from 'react'
import styled, {useTheme} from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from 'lib/ui/IconButton'

export default function DeleteIconButton(props: {
  onClick?: () => void
  className?: string
  color?: string
  'aria-label'?: string
}) {
  const theme = useTheme()
  const color = props.color || theme.colors.error

  return (
    <IconButton
      className={props.className}
      onClick={props.onClick}
      aria-label={props['aria-label']}
    >
      <Box>
        <StyledSettingsIcon color={color} />
      </Box>
    </IconButton>
  )
}

const Box = styled.div`
  background: #ffffff;
  display: inline-flex;
  border-radius: 4px;
`

const StyledSettingsIcon = styled((props: {color: string}) => {
  const {color, ...otherProps} = props

  return <CloseIcon {...otherProps} />
})`
  color: ${(props) => props.color};
`
