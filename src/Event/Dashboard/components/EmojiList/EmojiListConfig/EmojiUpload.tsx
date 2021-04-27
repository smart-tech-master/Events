import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {withStyles} from '@material-ui/core'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import {useOrganization} from 'organization/OrganizationProvider'

const imageUploadId = 'emoji-image-upload'
const MAX_FILE_SIZE_BYTES = 5000000 // 5MB

interface EmojiUploadResult {
  file: string
}

export default function EmojiUpload(props: {
  onSuccess: (emoji: string) => void
}) {
  const [file, setFile] = useState<null | File>(null)
  const {event} = useEvent()
  const {client} = useOrganization()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const clearError = () => setError(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setError('File is too big!')
      return
    }

    setFile(file)
  }

  const removeSelected = () => {
    setFile(null)
  }

  const upload = () => {
    if (!file || isUploading) {
      return
    }
    setIsUploading(true)

    clearError()
    const formData = new FormData()
    formData.set('file', file)
    const url = api(`/events/${event.slug}/emojis`)

    client
      .post<EmojiUploadResult>(url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then(({file}) => props.onSuccess(file))
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setIsUploading(false)
        removeSelected()
      })
  }

  return (
    <Box>
      <Button
        variant="outlined"
        color="primary"
        disabled={isUploading}
        aria-label="select image to upload"
      >
        <UploadButtonLabel htmlFor={imageUploadId}>
          Add Custom Emoji
        </UploadButtonLabel>
      </Button>
      <input
        id={imageUploadId}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        hidden
        aria-label="emoji upload input"
      />
      <Preview
        isUploading={isUploading}
        emoji={file}
        onCancel={removeSelected}
        onSave={upload}
      />
      <Error>{error}</Error>
    </Box>
  )
}

function Preview(props: {
  emoji: File | null
  onCancel: () => void
  onSave: () => void
  isUploading: boolean
}) {
  if (!props.emoji) {
    return null
  }

  const data = URL.createObjectURL(props.emoji)
  return (
    <ImagePreview>
      <img src={data} alt={props.emoji.name} aria-label="emoji preview" />
      <Button
        onClick={props.onCancel}
        variant="outlined"
        size="small"
        aria-label="cancel upload"
        disabled={props.isUploading}
      >
        Cancel
      </Button>
      <Button
        onClick={props.onSave}
        variant="outlined"
        color="primary"
        size="small"
        aria-label="upload emoji"
        disabled={props.isUploading}
      >
        Save
      </Button>
    </ImagePreview>
  )
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

const Box = styled.div`
  margin: 0 ${(props) => props.theme.spacing[4]};
`

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

const UploadButtonLabel = styled.label`
  cursor: pointer;
`

const ImagePreview = styled.div`
  width: 200px;
  margin-top: ${(props) => props.theme.spacing[3]};

  img {
    width: 100%;
    max-height: 100%;
  }
`
