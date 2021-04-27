import React from 'react'

export default function Visible(props: {
  when: boolean
  children: React.ReactElement
}) {
  if (!props.when) {
    return null
  }

  return props.children
}
