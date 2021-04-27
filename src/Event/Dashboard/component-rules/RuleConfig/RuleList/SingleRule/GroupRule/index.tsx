import React from 'react'
import {AND, BaseRule} from 'Event/Dashboard/component-rules'

export const GROUP = 'Group'
export const IS = 'is'
export const IS_NOT = 'is not'
export type GroupRule = BaseRule & {
  source: typeof GROUP
  type: typeof IS | typeof IS_NOT
  key: string
  target: string
}

export default function GroupRule(props: {rule: GroupRule}) {
  return (
    <div>
      {props.rule.key} {props.rule.type} {props.rule.target}
    </div>
  )
}

export const createGroupRule = (
  type: GroupRule['type'],
  key: GroupRule['key'],
  target: GroupRule['target'],
): GroupRule => ({
  condition: AND,
  source: GROUP,
  type,
  key,
  target,
})
