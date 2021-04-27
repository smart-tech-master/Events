import {useIsOwner} from 'organization/OwnerProvider'
import React from 'react'

export default function IfOwner(props: {children: React.ReactElement}) {
  const isOwner = useIsOwner()
  if (!isOwner) {
    return null
  }

  return props.children
}
