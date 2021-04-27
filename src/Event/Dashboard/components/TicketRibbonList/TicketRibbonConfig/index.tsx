import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import ColorPicker from 'lib/ui/ColorPicker'
import {useForm} from 'react-hook-form'
import {
  TicketRibbon,
  TICKET_RIBBON_IMAGE,
  TICKET_RIBBON,
} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {onChangeStringHandler, onUnknownChangeHandler} from 'lib/dom'
import Grid from '@material-ui/core/Grid'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'

export type TicketRibbonConfig = {
  type: typeof TICKET_RIBBON
  index: number
}

export function TicketRibbonConfig(props: {index: number}) {
  const {ticketRibbons} = useTemplate()
  const ticketRibbon = ticketRibbons[props.index]
  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()

  const {register, errors} = useForm()

  if (ticketRibbon === undefined) {
    throw new Error('Missing ticket ribbon; was it set properly via edit?')
  }

  const update = <T extends keyof TicketRibbon>(key: T) => (
    value: TicketRibbon[T],
  ) => {
    const updated = {
      ...ticketRibbon,
      [key]: value,
    }

    updateTemplate({
      ticketRibbons: ticketRibbons.map((tr, index) => {
        const isTarget = index === props.index
        if (isTarget) {
          return updated
        }

        return tr
      }),
    })
  }

  const remove = () => {
    const removed = ticketRibbons.filter((_, index) => index !== props.index)
    closeConfig()
    updateTemplate({
      ticketRibbons: removed,
    })
  }

  return (
    <>
      <FormControl fullWidth>
        <Select
          value={ticketRibbon.name}
          inputProps={{
            'aria-label': 'pick ticket ribbon',
          }}
          onChange={onUnknownChangeHandler(update('name'))}
        >
          {Object.entries(TICKET_RIBBON_IMAGE).map(([name, image]) => (
            <MenuItem key={name} value={name}>
              <Image src={image} alt={name} />
              <span>{name}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        name="text"
        defaultValue={ticketRibbon.text}
        fullWidth
        onChange={onChangeStringHandler(update('text'))}
        inputProps={{
          ref: register({
            maxLength: 8,
          }),
          'aria-label': 'ticket ribbon text input',
        }}
        error={!!errors.text}
        helperText={errors.text && errors.text.message}
      />
      <ColorPicker
        label="Ribbon Text Color"
        color={ticketRibbon.color}
        onPick={update('color')}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Group Name"
            value={ticketRibbon.group_name}
            fullWidth
            onChange={onChangeStringHandler(update('group_name'))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="group_value"
            label="Group Value"
            value={ticketRibbon.group_value}
            fullWidth
            onChange={onChangeStringHandler(update('group_value'))}
          />
        </Grid>
      </Grid>
      <RemoveButton
        fullWidth
        variant="outlined"
        aria-label="remove ticket ribbon"
        onClick={remove}
      >
        REMOVE TICKET RIBBON
      </RemoveButton>
    </>
  )
}

const Image = styled.img`
  margin-right: ${(props) => props.theme.spacing[2]};
  width: 40px;
`

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
