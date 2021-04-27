import Grid from '@material-ui/core/Grid'
import HiddenOnMatch from 'Event/Dashboard/component-rules/HiddenOnMatch'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'

export const MAIN_NAV_BUTTON = 'Main Nav Button'
type MainNavButtonProps = {
  id: string
  isEditMode?: boolean
  button: NavButtonWithSize
}

export default React.memo((props: MainNavButtonProps) => {
  return (
    <HiddenOnMatch rules={props.button.rules}>
      <Grid item xs={12} md={props.button.size}>
        <EditComponent
          component={{
            type: MAIN_NAV_BUTTON,
            id: props.id,
          }}
        >
          <NavButton {...props.button} aria-label="main nav button" />
        </EditComponent>
      </Grid>
    </HiddenOnMatch>
  )
})
