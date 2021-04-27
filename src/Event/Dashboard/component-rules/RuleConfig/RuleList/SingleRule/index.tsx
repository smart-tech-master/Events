import {Rule} from 'Event/Dashboard/component-rules'
import styled from 'styled-components'
import GroupRule, {
  GROUP,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import ConditionSelector from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/ConditionSelector'
import {TAGS} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import NestedRule from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import TagsRule from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import {NESTED_RULE} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule'

export default function SingleRule(props: {
  rule: Rule
  isFirstRule: boolean
  className?: string
  onEdit: () => void
  onUpdate: (rule: Rule) => void
}) {
  const updateCondition = (condition: Rule['condition']) => {
    props.onUpdate({
      ...props.rule,
      condition,
    })
  }

  return (
    <Box className={props.className}>
      <StyledConditionSelector
        visible={!props.isFirstRule}
        onSelect={updateCondition}
        rule={props.rule}
      />
      <Content onClick={props.onEdit}>
        <RuleValue rule={props.rule} />
      </Content>
    </Box>
  )
}

function RuleValue(props: {rule: Rule}) {
  switch (props.rule.source) {
    case TAGS:
      return <TagsRule rule={props.rule} />
    case GROUP:
      return <GroupRule rule={props.rule} />
    case NESTED_RULE:
      return <NestedRule rule={props.rule} />
  }
}

const Box = styled.div`
  display: flex;
`

const Content = styled.div`
  flex: 1;
  padding: ${(props) => `${props.theme.spacing[2]} ${props.theme.spacing[4]}`};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${grey[100]};
  }
`

const StyledConditionSelector = styled(ConditionSelector)`
  margin-right: ${(props) => props.theme.spacing[2]}!important;
`
