import React from 'react'
import styled from 'styled-components'
import * as H from 'history'
import {Link as RouterLink} from 'react-router-dom'
import {LinkProps} from 'lib/ui/link'
import {useLinkStyle} from 'lib/ui/link/style'

type Props = LinkProps & {
  to: H.LocationDescriptor<H.LocationState>
}

export const RelativeLink = React.forwardRef(
  (props: Props, ref: React.Ref<HTMLAnchorElement>) => {
    const style = useLinkStyle(props)
    const handleOnClick = (e: React.MouseEvent) => e.preventDefault()

    if (props.disabled) {
      return (
        <DisabledLink
          ref={ref}
          className={props.className}
          onClick={handleOnClick}
          aria-label={props['aria-label']}
        >
          {props.children}
        </DisabledLink>
      )
    }

    return (
      <StyledRouterLink
        forwardedRef={ref}
        className={props.className}
        to={props.to}
        underline={style.underline}
        color={style.color}
        aria-label={props['aria-label']}
      >
        {props.children}
      </StyledRouterLink>
    )
  },
)

const StyledRouterLink = styled((props) => {
  const {underline: _u, forwardedRef, ...otherProps} = props
  return <RouterLink ref={forwardedRef} {...otherProps} />
})`
  color: ${(props) => props.color};
  cursor: pointer;
  font-size: inherit;
  &:hover {
    ${(props) => (props.underline ? 'text-decoration: underline;' : null)}
  }
`

const DisabledLink = styled.a`
  cursor: not-allowed;
  font-size: inherit;
  opacity: 0.4;
`
