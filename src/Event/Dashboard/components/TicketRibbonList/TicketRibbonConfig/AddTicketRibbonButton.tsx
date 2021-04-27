import Button from '@material-ui/core/Button'
import {
  BLUE_RIBBON,
  TicketRibbon,
  TICKET_RIBBON,
} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import React from 'react'
import {useDispatch} from 'react-redux'

export default function AddTicketRibbonButton(props: {className?: string}) {
  const dispatch = useDispatch()
  const {ticketRibbons} = useTemplate()
  const updateTemplate = useUpdateTemplate()

  const existingRibbons = ticketRibbons || []

  const add = () => {
    const newRibbon: TicketRibbon = {
      name: BLUE_RIBBON,
      text: '',
      color: '#ffffff',
      group_name: '',
      group_value: '',
    }

    const ticketRibbons = [...existingRibbons, newRibbon]

    updateTemplate({
      ticketRibbons,
    })

    const lastIndex = ticketRibbons.length - 1
    dispatch(setConfig({type: TICKET_RIBBON, index: lastIndex}))
  }
  return (
    <Button
      aria-label="add ticket ribbon"
      fullWidth
      size="large"
      variant="outlined"
      color="primary"
      onClick={add}
      className={props.className}
    >
      Add Ticket Ribbon
    </Button>
  )
}
