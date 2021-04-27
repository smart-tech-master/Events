import React from 'react'
import styled from 'styled-components'
import {DateTimePicker} from '@material-ui/pickers'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {AGENDA, Agenda} from 'Event/Dashboard/components/AgendaList'
import {onChangeStringHandler} from 'lib/dom'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'

export type AgendaConfig = {
  type: typeof AGENDA
  id: number
}

export function AgendaConfig(props: {id: AgendaConfig['id']}) {
  const {agendas} = useTemplate()
  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()

  if (!agendas) {
    throw new Error('Missing agendas; was it set properly via edit?')
  }

  if (props.id === undefined || typeof props.id !== 'number') {
    throw new Error('Missing component id')
  }

  const agenda = agendas[props.id]

  const update = <T extends keyof Agenda>(key: T) => (value: Agenda[T]) => {
    const updated = {
      ...agenda,
      [key]: value,
    }

    updateTemplate({
      agendas: agendas.map((a, index) => {
        const isTarget = index === props.id
        if (isTarget) {
          return updated
        }

        return a
      }),
    })
  }

  const remove = () => {
    const withoutTarget = agendas.filter((_, index) => index !== props.id)
    closeConfig()
    updateTemplate({
      agendas: withoutTarget,
    })
  }

  const updateDate = (key: 'startDate' | 'endDate') => (
    date: MaterialUiPickersDate,
  ) => {
    if (date) {
      update(key)(date.toISOString())
      return
    }

    if (key === 'endDate') {
      update(key)(null)
      return
    }

    throw new Error('Start date cannot be empty')
  }

  return (
    <>
      <TextField
        value={agenda.text}
        inputProps={{
          'aria-label': 'agenda text',
        }}
        label="Event"
        fullWidth
        onChange={onChangeStringHandler(update('text'))}
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DateTimePicker
            value={agenda.startDate}
            onChange={updateDate('startDate')}
            fullWidth
            label="Start"
            inputProps={{
              'aria-label': 'agenda start date',
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <DateTimePicker
            clearable
            value={agenda.endDate}
            onChange={updateDate('endDate')}
            fullWidth
            label="End"
            inputProps={{
              'aria-label': 'agenda end date',
            }}
          />
        </Grid>
      </Grid>
      <TextField
        value={agenda.link || ''}
        inputProps={{
          'aria-label': 'agenda link',
        }}
        label="Link"
        fullWidth
        onChange={onChangeStringHandler(update('link'))}
      />
      <RemoveAgendaButton
        fullWidth
        variant="outlined"
        aria-label="remove agenda"
        onClick={remove}
      >
        REMOVE AGENDA
      </RemoveAgendaButton>
    </>
  )
}

const RemoveAgendaButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
