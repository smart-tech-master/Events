import {Rule} from 'Event/Dashboard/component-rules'
import styled from 'styled-components'
import React from 'react'
import {useState} from 'react'
import RuleList from 'Event/Dashboard/component-rules/RuleConfig/RuleList'

export default function RuleConfig(props: {
  children: React.ReactElement
  visible: boolean
  close: () => void
  onChange: (rules: Rule[]) => void
  rules: Rule[]
}) {
  if (!props.visible) {
    return props.children
  }

  return (
    <Box>
      <RuleList
        rules={props.rules}
        close={props.close}
        onChange={props.onChange}
      />
    </Box>
  )
}

export function useRuleConfig() {
  const [visible, setVisible] = useState(false)

  const toggle = () => setVisible(!visible)

  return {
    visible,
    toggle,
  }
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`
