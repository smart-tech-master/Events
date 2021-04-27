import React from 'react'
import styled from 'styled-components'
import {LinkProps} from 'lib/ui/link'
import {useLinkStyle} from 'lib/ui/link/style'

type Props = LinkProps & {
  to: string
  newTab?: boolean
}

export const AbsoluteLink = React.forwardRef(
  (props: Props, ref: React.Ref<any>) => {
    const target = props.newTab ? '_blank' : '_self'
    const rel = props.newTab ? 'noopener noreferrer' : ''

    const style = useLinkStyle(props)

    return (
      <StyledAnchor
        ref={ref}
        href={props.to}
        underline={style.underline}
        color={style.color}
        className={props.className}
        target={target}
        rel={rel}
        aria-label={props['aria-label']}
      >
        {props.children}
      </StyledAnchor>
    )
  },
)

const StyledAnchor = styled.a<{
  underline?: boolean
  color: string
}>`
  font-size: inherit;
  color: ${(props) => props.color};
  cursor: pointer;
  &:hover {
    ${(props) =>
      props.underline ? 'text-decoration: underline' : 'text-decoration: none'};
  }
`
