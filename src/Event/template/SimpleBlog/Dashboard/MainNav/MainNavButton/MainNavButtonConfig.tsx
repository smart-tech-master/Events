import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {
  handleChangeSlider,
  onChangeCheckedHandler,
  onChangeNumberHandler,
  onChangeStringHandler,
} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import Box from '@material-ui/core/Box'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import RuleConfig, {
  useRuleConfig,
} from 'Event/Dashboard/component-rules/RuleConfig'
import ConfigureRulesButton from 'Event/Dashboard/component-rules/ConfigureRulesButton'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {MAIN_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton'

export type MainNavButtonConfig = {
  type: typeof MAIN_NAV_BUTTON
  id: string
}

export function MainNavButtonConfig(props: {id: MainNavButtonConfig['id']}) {
  const {mainNav: buttons} = useTemplate()

  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()
  const {id} = props

  if (!id) {
    throw new Error('Missing component id')
  }

  if (!buttons) {
    throw new Error('Missing nav buttons')
  }
  const button = buttons.entities[id]

  const update = (updated: NavButtonWithSize) => {
    updateTemplate({
      mainNav: {
        ...buttons,
        entities: {
          ...buttons.entities,
          [id]: updated,
        },
      },
    })
  }

  const removeButton = () => {
    const {[id]: target, ...otherButtons} = buttons.entities
    const updatedIds = buttons.ids.filter((i) => i !== id)

    closeConfig()
    updateTemplate({
      mainNav: {
        entities: otherButtons,
        ids: updatedIds,
      },
    })
  }

  const updateButton = <T extends keyof NavButtonWithSize>(key: T) => (
    value: NavButtonWithSize[T],
  ) =>
    update({
      ...button,
      [key]: value,
    })

  return (
    <RuleConfig
      visible={ruleConfigVisible}
      close={toggleRuleConfig}
      rules={button.rules}
      onChange={updateButton('rules')}
    >
      <>
        <ConfigureRulesButton onClick={toggleRuleConfig} />
        <TextField
          label="Text"
          value={button.text}
          inputProps={{
            'aria-label': 'button name input',
          }}
          fullWidth
          onChange={onChangeStringHandler(updateButton('text'))}
        />
        <Typography gutterBottom>Size</Typography>
        <Slider
          min={1}
          max={12}
          onChange={handleChangeSlider(updateButton('size'))}
          valueLabelDisplay="auto"
          value={button.size || 0}
        />
        <TextField
          label="Link URL"
          value={button.link}
          inputProps={{
            'aria-label': 'button link input',
          }}
          fullWidth
          onChange={onChangeStringHandler(updateButton('link'))}
        />
        <FormControl>
          <FormControlLabel
            label="New Tab"
            control={
              <Checkbox
                checked={button.newTab}
                onChange={onChangeCheckedHandler(updateButton('newTab'))}
              />
            }
          />
        </FormControl>
        <ColorPicker
          label="Background Color"
          color={button.backgroundColor}
          onPick={updateButton('backgroundColor')}
        />
        <ColorPicker
          label="Hover Background Color"
          color={button.hoverBackgroundColor}
          onPick={updateButton('hoverBackgroundColor')}
        />
        <ColorPicker
          label="Text Color"
          color={button.textColor}
          onPick={updateButton('textColor')}
        />
        <ColorPicker
          label="Border Color"
          color={button.borderColor}
          onPick={updateButton('borderColor')}
        />
        <ColorPicker
          label="Hover Border Color"
          color={button.hoverBorderColor}
          onPick={updateButton('hoverBorderColor')}
        />
        <TextField
          value={button.borderWidth || ''}
          label="Border Width"
          type="number"
          fullWidth
          inputProps={{
            min: 0,
          }}
          onChange={onChangeNumberHandler(updateButton('borderWidth'))}
        />
        <TextField
          value={button.borderRadius || ''}
          label="Border Radius"
          type="number"
          fullWidth
          inputProps={{
            min: 0,
          }}
          onChange={onChangeNumberHandler(updateButton('borderRadius'))}
        />

        <Box mt={2} mb={3}>
          <DangerButton
            fullWidth
            variant="outlined"
            aria-label="remove button"
            onClick={removeButton}
          >
            REMOVE BUTTON
          </DangerButton>
        </Box>
      </>
    </RuleConfig>
  )
}
