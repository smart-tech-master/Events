import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {MAIN_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton'
import React from 'react'
import {useDispatch} from 'react-redux'
import {v4 as uid} from 'uuid'

export default function NewMainNavButton() {
  const {mainNav: buttons} = useTemplate()
  const updateTemplate = useUpdateTemplate()
  const dispatch = useDispatch()

  if (!buttons) {
    return null
  }

  const addButton = () => {
    const id = uid()
    const button: NavButtonWithSize = {
      text: 'Button',
      link: '',
      size: 12,
      rules: [],
    }
    const entities = {
      ...buttons.entities,
      [id]: button,
    }
    const ids = [...buttons.ids, id]

    updateTemplate({
      mainNav: {
        entities,
        ids,
      },
    })

    // Show config after adding button
    dispatch(setConfig({type: MAIN_NAV_BUTTON, id}))
  }
  return (
    <Grid item xs={12}>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        color="primary"
        aria-label="add main nav button"
        onClick={addButton}
      >
        New Button
      </Button>
    </Grid>
  )
}
