export interface LinkBaseProps {
  className?: string
  children: string | React.ReactNode
  disabled?: boolean
  'aria-label'?: string
}

export interface LinkStyleProps {
  disableStyles?: boolean
  noUnderline?: boolean
}

export type LinkProps = LinkBaseProps & LinkStyleProps
