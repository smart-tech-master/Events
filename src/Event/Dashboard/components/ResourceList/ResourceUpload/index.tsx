import React, {useState} from 'react'
import {api} from 'lib/url'
import CircularProgress from '@material-ui/core/CircularProgress'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {Resource} from 'Event/Dashboard/components/ResourceList'
import UploadDropzone from 'Event/Dashboard/components/ResourceList/ResourceUpload/UploadDropzone'
import UploadedFile from 'Event/Dashboard/components/ResourceList/ResourceUpload/UploadedFile'

export const ACCEPTED_FILE_TYPES = ['image/*', '.pdf']
export const MAX_FILE_SIZE_BYTES = 20000000
export const MAX_NUM_FILES = 1

interface ResourceUpload {
  file: string
}

export default function ResourceUpload(props: {
  resource: Resource
  update: <T extends keyof Resource>(key: T) => (value: Resource[T]) => void
}) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const deleteFile = useDeleteFile()

  const hasExistingFile = props.resource.filePath

  const clearError = () => setError(null)

  const upload = (file: File) => {
    clearError()
    const formData = new FormData()
    formData.set('file', file)
    const url = api(`/events/${event.slug}/resources`)

    client
      .post<ResourceUpload>(url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((upload) => {
        props.update('filePath')(upload.file)
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  const handleUpload = async (acceptedFile: File) => {
    if (hasExistingFile) {
      removeFile(props.resource).then(() => {
        upload(acceptedFile)
      })
      return
    }

    upload(acceptedFile)
  }

  const removeFile = async (resource: Resource): Promise<void> => {
    setIsUploading(true)
    return deleteFile(resource.filePath)
      .then(() => {
        props.update('filePath')('')
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  return (
    <>
      <UploadDropzone onDrop={handleUpload} />
      <LoadingOverlay visible={isUploading} />
      <UploadedFile resource={props.resource} onRemoveFile={removeFile} />
      <Error>{error}</Error>
    </>
  )
}

function LoadingOverlay(props: {visible: boolean}) {
  if (!props.visible) {
    return null
  }

  return (
    <LoaderWrapper>
      <CircularProgress />
    </LoaderWrapper>
  )
}

function useDeleteFile() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (file: string) => {
    const url = api(`/events/${event.slug}/resources/${file}`)
    return client.delete(url)
  }
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return (
    <ErrorText color="error">
      We could not upload your file: {props.children}
    </ErrorText>
  )
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
