import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import React, {useState} from 'react'
import {Rule} from 'Event/Dashboard/component-rules'
import {onUnknownChangeHandler} from 'lib/dom'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import SourceConfig from 'Event/Dashboard/component-rules/RuleConfig/RuleList/RuleForm/SourceConfig'
import DangerButton from 'lib/ui/Button/DangerButton'
import Visible from 'lib/ui/layout/Visible'
import Box from '@material-ui/core/Box'
import {TAGS} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import {NESTED_RULE} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import {GROUP} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'

const ALL_SOURCES = [TAGS, GROUP, NESTED_RULE]

export default function RuleForm(props: {
  close: () => void
  onCreate: (rule: Rule) => void
  rule: Rule | null
  onDelete: () => void
}) {
  const initialSource = props.rule ? props.rule.source : null
  const initialRule = props.rule || null
  const [source, setSource] = useState<null | Rule['source']>(initialSource)
  const [rule, setRule] = useState<null | Rule>(initialRule)
  const [controlsVisible, setControlsVisible] = useState(true)
  const toggleControlVisibility = () => setControlsVisible(!controlsVisible)
  const showDelete = Boolean(props.rule)

  const save = () => {
    if (!rule) {
      return
    }

    props.onCreate(rule)
  }
  return (
    <>
      <Visible when={controlsVisible}>
        <>
          <DeleteRuleButton visible={showDelete} onClick={props.onDelete} />
          <Typography paragraph>Hide component when</Typography>
          <FormControl fullWidth>
            <Select
              value={source || ''}
              fullWidth
              onChange={onUnknownChangeHandler(setSource)}
              label="Source"
              inputProps={{
                'aria-label': 'pick rule source',
              }}
            >
              {Object.values(ALL_SOURCES).map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      </Visible>
      <SourceConfig
        source={source}
        onSet={setRule}
        rule={rule}
        onToggleNestedRule={toggleControlVisibility}
      />
      <Visible when={controlsVisible}>
        <Box pt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button onClick={props.close} fullWidth variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                disabled={!rule}
                onClick={save}
                aria-label="save rule"
              >
                Save
              </Button>
            </Grid>
          </Grid>{' '}
        </Box>
      </Visible>
    </>
  )
}

function DeleteRuleButton(props: {visible: boolean; onClick: () => void}) {
  if (!props.visible) {
    return null
  }

  return (
    <StyledDangerButton
      onClick={props.onClick}
      variant="outlined"
      size="small"
      fullWidth
      aria-label="remove rule"
    >
      Delete
    </StyledDangerButton>
  )
}

const StyledDangerButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
`
