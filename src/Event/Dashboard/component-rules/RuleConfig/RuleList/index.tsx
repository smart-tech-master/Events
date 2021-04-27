import {Rule} from 'Event/Dashboard/component-rules'
import styled from 'styled-components'
import React, {useState} from 'react'
import RuleComponent from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule'
import BackButton from 'Event/Dashboard/component-rules/RuleConfig/BackButton'
import MuiButton from '@material-ui/core/Button'
import RuleForm from 'Event/Dashboard/component-rules/RuleConfig/RuleList/RuleForm'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import {withStyles} from '@material-ui/core'
import Visible from 'lib/ui/layout/Visible'

export default function RuleList(props: {
  rules: Rule[]
  close?: () => void
  onChange: (rules: Rule[]) => void
  onToggleRuleConfig?: () => void
  descriptionHidden?: boolean
  className?: string
}) {
  const [ruleConfigVisible, setRuleConfigVisible] = useState(false)
  const toggleRuleConfig = () => {
    setRuleConfigVisible(!ruleConfigVisible)

    if (props.onToggleRuleConfig) {
      props.onToggleRuleConfig()
    }
  }
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number | null>(
    null,
  )
  const rule =
    selectedRuleIndex !== null ? props.rules[selectedRuleIndex] : null

  const addNewRule = () => {
    setSelectedRuleIndex(null)
    toggleRuleConfig()
  }

  const editRule = (index: number) => {
    setSelectedRuleIndex(index)
    toggleRuleConfig()
  }

  const createRule = (rule: Rule) => {
    const updated = [...props.rules, rule]
    props.onChange(updated)
  }

  const updateRule = (index: number, rule: Rule) => {
    const updated = props.rules.map((r, i) => (i === index ? rule : r))
    props.onChange(updated)
    setRuleConfigVisible(false)
  }

  const saveRule = (rule: Rule) => {
    if (selectedRuleIndex !== null) {
      updateRule(selectedRuleIndex, rule)
    } else {
      createRule(rule)
    }

    toggleRuleConfig()
  }

  const deleteRule = () => {
    toggleRuleConfig()
    const removed = props.rules.filter((_, i) => i !== selectedRuleIndex)
    props.onChange(removed)
  }

  if (ruleConfigVisible) {
    return (
      <RuleForm
        close={toggleRuleConfig}
        onDelete={deleteRule}
        onCreate={saveRule}
        rule={rule}
      />
    )
  }

  return (
    <div className={props.className}>
      <CloseRules onClick={props.close} />
      <Rules
        rules={props.rules}
        onEditRule={editRule}
        updateRule={updateRule}
        descriptionHidden={props.descriptionHidden}
      />
      <MuiButton
        variant="outlined"
        color="primary"
        fullWidth
        onClick={addNewRule}
        aria-label="add rule"
      >
        Add Rule
      </MuiButton>
    </div>
  )
}

function CloseRules(props: {onClick?: () => void}) {
  if (!props.onClick) {
    return null
  }
  return <StyledBackButton onClick={props.onClick} />
}

function Rules(props: {
  rules: Rule[]
  updateRule: (index: number, rule: Rule) => void
  onEditRule: (index: number) => void
  descriptionHidden?: boolean
}) {
  const hasRules = props.rules.length > 0

  if (!hasRules && !props.descriptionHidden) {
    return <EmptyRulesText>No rules have been added</EmptyRulesText>
  }

  const updateAtIndex = (index: number) => (rule: Rule) =>
    props.updateRule(index, rule)

  return (
    <RulesContainer>
      <Visible when={!props.descriptionHidden}>
        <RulesDescription>Component will be hidden when </RulesDescription>
      </Visible>
      {props.rules.map((rule, index) => (
        <StyledRule
          key={index}
          rule={rule}
          isFirstRule={index === 0}
          onUpdate={updateAtIndex(index)}
          onEdit={() => props.onEditRule(index)}
        />
      ))}
    </RulesContainer>
  )
}

const RulesContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`

const StyledBackButton = styled(BackButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
const EmptyRulesText = styled.p`
  margin: ${(props) => props.theme.spacing[4]} 0;
  text-align: center;
`

const StyledRule = styled(RuleComponent)`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const RulesDescription = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
