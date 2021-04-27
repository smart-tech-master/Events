import React from 'react'

export default function IfExists<T>(
  props: {
    children?: string | null
    Component: React.FunctionComponent<T> | React.ComponentClass<T>
  } & T,
) {
  const {children, Component, ...otherProps} = props
  if (!children) {
    return null
  }

  const componentProps = (otherProps as unknown) as T
  return <Component {...componentProps}>{children}</Component>
}
