import React from 'react'
import {Button} from '@material-ui/core'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {AGENDA} from 'Event/Dashboard/components/AgendaList'
import {useDispatch} from 'react-redux'

export default function AddAgendaEventButton(props: {className?: string}) {
  const {agendas} = useTemplate()
  const updateTemplate = useUpdateTemplate()
  const dispatch = useDispatch()

  const existingAgendas = agendas || []

  const addEvent = () => {
    const agendas = [
      ...existingAgendas,
      {
        text: 'Event',
        startDate: new Date().toISOString(),
        endDate: null,
        link: null,
      },
    ]
    updateTemplate({
      agendas,
    })

    const lastItem = agendas.length - 1
    dispatch(setConfig({type: AGENDA, id: lastItem}))
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add agenda event"
      onClick={addEvent}
      className={props.className}
    >
      Add Agenda Event
    </Button>
  )
}
