import {useTheme} from 'styled-components'
import {LinkStyleProps} from 'lib/ui/link'

export function useLinkStyle(props: LinkStyleProps) {
  const color = useColor(props)

  const underline = !props.disableStyles && !props.noUnderline

  return {
    color,
    underline,
  }
}

function useColor(props: LinkStyleProps) {
  const theme = useTheme()
  if (props.disableStyles) {
    return 'inherit'
  }

  return theme.colors.secondary
}
