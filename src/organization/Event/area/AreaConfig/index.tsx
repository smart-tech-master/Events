import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {withStyles} from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import {onChangeCheckedHandler} from 'lib/dom'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {spacing} from 'lib/ui/theme'
import RoomList from 'organization/Event/area/AreaConfig/RoomList'
import {useArea} from 'organization/Event/area/AreaProvider'
import {useAreaRoutes} from 'organization/Event/area/AreaRoutes'
import Layout from 'organization/user/Layout'
import Page from 'organization/user/Layout/Page'
import React from 'react'

export default function AreaConfig() {
  const {area, update, processing} = useArea()
  const routes = useAreaRoutes()

  return (
    <Layout>
      <Page>
        <Title variant="h5">Area: {area.name}</Title>
        <FormControlLabel
          disabled={processing}
          control={
            <Switch
              checked={area.is_open}
              onChange={onChangeCheckedHandler(update('is_open'))}
              color="primary"
              inputProps={{
                'aria-label': 'toggle area open status',
              }}
            />
          }
          label="Open"
        />
        <FormControl
          required
          component="fieldset"
          fullWidth
          disabled={processing}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={area.requires_approval}
                onChange={onChangeCheckedHandler(update('requires_approval'))}
                inputProps={{
                  'aria-label': 'toggle requires approval',
                }}
              />
            }
            label="Requires approval?"
          />
        </FormControl>
        <FormControl
          required
          component="fieldset"
          fullWidth
          disabled={processing}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={area.allows_multiple_devices}
                inputProps={{
                  'aria-label': 'toggle allows multiple devices',
                }}
                onChange={onChangeCheckedHandler(
                  update('allows_multiple_devices'),
                )}
              />
            }
            label="Can the same user use multiple devices to join at the same time?"
          />
        </FormControl>
        <RelativeLink to={routes.rooms.create} disableStyles>
          <Button variant="outlined" color="primary" aria-label="create room">
            Create Room
          </Button>
        </RelativeLink>
        <RoomList />
      </Page>
    </Layout>
  )
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)
