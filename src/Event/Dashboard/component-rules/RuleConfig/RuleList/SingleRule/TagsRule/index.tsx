import {AND, BaseRule} from 'Event/Dashboard/component-rules'
import React from 'react'

export const TAGS = 'Tags'
export const INCLUDE = 'include'
export const DOES_NOT_INCLUDE = 'does not include'

export type TagsRule = BaseRule & {
  source: typeof TAGS
  type: typeof INCLUDE | typeof DOES_NOT_INCLUDE
  target: string
}

export default function TagsRule(props: {rule: TagsRule}) {
  return (
    <div>
      tags {props.rule.type} {props.rule.target}
    </div>
  )
}

export const createTagsRule = (
  type: TagsRule['type'],
  target: string,
): TagsRule => ({
  condition: AND,
  source: TAGS,
  type,
  target,
})
