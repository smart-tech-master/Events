import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import RuleList from 'Event/Dashboard/component-rules/RuleConfig/RuleList'
import {RuleConfigProps} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/RuleForm/SourceConfig'
import {Rule} from 'Event/Dashboard/component-rules'
import Visible from 'lib/ui/layout/Visible'
import React, {useEffect, useState} from 'react'
import {
  createNestedRule,
  NestedRule,
  NESTED_RULE,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule'

export default function NestedRuleConfig(props: RuleConfigProps) {
  const [rules, setRules] = useState<NestedRule['rules']>(
    initialRules(props.rule),
  )
  const {onSet} = props
  const [descriptionVisible, setDescriptionVisible] = useState(true)

  const handleShowingRuleConfig = () => {
    if (props.onToggleNestedRule) {
      props.onToggleNestedRule()
    }

    setDescriptionVisible(!descriptionVisible)
  }

  useEffect(() => {
    onSet(createNestedRule(rules))
  }, [rules, onSet])

  return (
    <>
      <Visible when={descriptionVisible}>
        <Box mb={3}>
          <Typography>With these rules are true</Typography>
        </Box>
      </Visible>
      <StyledRuleList
        rules={rules}
        onChange={setRules}
        onToggleRuleConfig={handleShowingRuleConfig}
        descriptionHidden
      />
    </>
  )
}

function initialRules(rule: Rule | null) {
  if (!rule || rule.source !== NESTED_RULE) {
    return []
  }

  return rule.rules
}

const StyledRuleList = styled(RuleList)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
