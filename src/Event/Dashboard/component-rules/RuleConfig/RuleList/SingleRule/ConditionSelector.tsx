import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {AND, OR, Rule} from 'Event/Dashboard/component-rules'
import {onUnknownChangeHandler} from 'lib/dom'
import React from 'react'
import {withStyles} from '@material-ui/core'
import {spacing} from 'lib/ui/theme'

export default function ConditionSelector(props: {
  visible: boolean
  onSelect: (condition: Rule['condition']) => void
  rule: Rule
  className?: string
}) {
  if (!props.visible) {
    return null
  }

  return (
    <ConditionSelect
      value={props.rule.condition}
      onChange={onUnknownChangeHandler(props.onSelect)}
      inputProps={{
        'aria-label': 'update rule condition',
      }}
      variant="outlined"
      className={props.className}
    >
      <MenuItem value={AND}>and</MenuItem>
      <MenuItem value={OR}>or</MenuItem>
    </ConditionSelect>
  )
}

const ConditionSelect = withStyles({
  root: {
    padding: '10px 36px 8px 14px',
    marginRight: spacing[2],
    width: '35px',
  },
})(Select)
