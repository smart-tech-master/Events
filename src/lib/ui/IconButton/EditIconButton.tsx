import React from 'react'
import styled, {useTheme} from 'styled-components'
import SettingsIcon from '@material-ui/icons/Settings'
import IconButton from 'lib/ui/IconButton'

export default function EditIconButton(props: {
  onClick?: () => void
  className?: string
  color?: string
}) {
  const theme = useTheme()
  const color = props.color || theme.colors.primary

  return (
    <IconButton className={props.className} onClick={props.onClick}>
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

  return <SettingsIcon {...otherProps} />
})`
  color: ${(props) => props.color};
`
