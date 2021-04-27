import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import FormHelperText from '@material-ui/core/FormHelperText'
import {useForm} from 'react-hook-form'
import Layout from 'organization/user/Layout'
import Page from 'organization/user/Layout/Page'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {ObvioEvent} from 'Event'
import {useDispatch} from 'react-redux'
import {setEvent} from 'Event/state/actions'
import {useHistory} from 'react-router-dom'
import {useEventRoutes} from 'organization/Event/EventRoutes'

export interface TechCheckData {
  body: string
}

export default () => {
  const {register, handleSubmit, watch, setValue, errors} = useForm()
  const [loading, setLoading] = useState(true)
  const [responseError, setResponseError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const setTechCheck = useSetTechCheck()
  const dispatch = useDispatch()
  const history = useHistory()
  const routes = useEventRoutes()
  const mounted = useRef(true)
  const {event} = useEvent()

  const setBody = (_: any, editor: any) => {
    setValue('body', editor.getData())
  }

  const goToDashboardConfig = () => {
    history.push(routes.dashboard)
  }

  const submit = (data: TechCheckData) => {
    setSubmitting(true)
    setTechCheck(data)
      .then((event) => {
        dispatch(setEvent(event))
        goToDashboardConfig()
      })
      .catch((e) => {
        setResponseError(e.message)
        setSubmitting(false)
      })
  }

  useEffect(() => {
    if (!mounted.current) {
      return
    }

    if (!event.tech_check) {
      setLoading(false)
      return
    }

    setValue('body', event.tech_check.body)

    setLoading(false)
    return () => {
      mounted.current = false
    }
  }, [event, setValue])

  return (
    <Layout>
      <Page>
        <Title variant="h5">Tech Check</Title>
        <form onSubmit={handleSubmit(submit)}>
          <Editor>
            <input
              type="hidden"
              name="body"
              aria-label="tech check body"
              ref={register({required: 'Body is required.'})}
            />
            <BodyLabel required error={!!errors.body}>
              Body
            </BodyLabel>
            {loading ? null : (
              <CKEditor
                editor={ClassicEditor}
                data={watch('body')}
                onChange={setBody}
                config={{
                  toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'blockQuote',
                    'link',
                    'numberedList',
                    'bulletedList',
                    'insertTable',
                  ],
                }}
              />
            )}

            <BodyError error={errors.body} />
          </Editor>
          <Error>{responseError}</Error>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            aria-label="save tech check"
            disabled={submitting}
          >
            Save
          </Button>
        </form>
      </Page>
    </Layout>
  )
}

const BodyError = (props: {error?: {message: string}}) => {
  if (!props.error) {
    return null
  }

  return <FormHelperText error>{props.error.message}</FormHelperText>
}

const Error = (props: {children: string}) => {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const useSetTechCheck = () => {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/tech_check`)

  return (data: TechCheckData) => client.put<ObvioEvent>(url, data)
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

const BodyLabel = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(InputLabel)

const Editor = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[6]};

  .ck-editor__editable_inline {
    min-height: 300px;
    max-height: 600px;
  }
`
