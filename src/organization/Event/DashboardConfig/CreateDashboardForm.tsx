import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import TemplateSelect from 'Event/template/TemplateSelect'
import {createTemplate} from 'Event/state/actions'
import {spacing} from 'lib/ui/theme'
import Page from 'organization/user/Layout/Page'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {Template} from 'Event/template'

export default function CreateTemplateForm() {
  const [template, setTemplate] = useState<Template['name'] | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!template) {
      return
    }

    dispatch(createTemplate(template))
  }, [template, dispatch])

  return (
    <Page>
      <Description>Pick a template below to get started...</Description>
      <TemplateSelect value={template} onPick={setTemplate} />
    </Page>
  )
}

const Description = withStyles({
  root: {
    marginBottom: spacing[2],
  },
})(Typography)
