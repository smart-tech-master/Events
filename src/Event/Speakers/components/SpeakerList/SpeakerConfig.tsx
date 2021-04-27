import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {SPEAKER} from 'Event/Speakers/components/SpeakerList'
import {onChangeStringHandler} from 'lib/dom'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {
  useTemplate,
  useUpdateSpeaker,
  useRemoveSpeaker,
} from 'Event/Speakers/state/TemplateProvider'
import {Speaker} from 'Event'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {debounce} from 'throttle-debounce'

export type SpeakerConfig = {
  type: typeof SPEAKER
  id: number
}

const imageUploadId = 'speaker-image-upload'

export function SpeakerConfig(props: {id: SpeakerConfig['id']}) {
  const [image, setImage] = useState<null | File>(null)

  const speakerTemplate = useTemplate()
  const {speakers} = speakerTemplate

  const updateSpeaker = useUpdateSpeaker()
  const removeSpeaker = useRemoveSpeaker()
  const closeConfig = useCloseConfig()

  const {event} = useEvent()
  const {client} = useOrganization()

  if (props.id === undefined || typeof props.id !== 'number') {
    throw new Error('Missing component id')
  }

  if (!speakers) {
    throw new Error('Missing speakers')
  }

  const speaker = speakers[props.id]

  const update = (updated: Speaker, isImageUpdate: boolean) => {
    const formData = new FormData()
    if (isImageUpdate) {
      formData.set('image', updated.image)
    }

    formData.set('name', updated.name)
    formData.set('text', updated.text)

    const url = api(`/events/${event.slug}/speaker_page/speaker/${speaker.id}`)

    client.post<Speaker>(url, formData).then((response: Speaker) => {
      updateSpeaker({...response})
    })
  }

  const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files ? evt.target.files[0] : null
    if (file) {
      setSpeaker('image')(file)
      setImage(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setSpeaker('image')('')
  }

  const remove = () => {
    const find = speakers.filter((_, index) => index === props.id)
    if (find) {
      const url = api(
        `/events/${event.slug}/speaker_page/speaker/${find[0].id}`,
      )

      client.delete(url).then(() => {
        closeConfig()
        removeSpeaker(find[0].id)
      })
    }
  }

  const setSpeaker = <T extends keyof Speaker>(key: T) => (
    value: Speaker[T],
  ) => {
    const updated = {
      ...speaker,
      [key]: value,
    }
    updateSpeaker({
      ...updated,
    })

    let isImageUpdate = false
    if (key === 'image' && value) {
      isImageUpdate = true
    }
    postUpdatedSpeaker(updated, isImageUpdate)
  }

  const postUpdatedSpeaker = useCallback(
    debounce(1000, false, (speaker: Speaker, isImageUpdate: boolean) => {
      update(speaker, isImageUpdate)
    }),
    [client],
  )

  const save = (_: any, editor: any) => setSpeaker('text')(editor.getData())

  return (
    <>
      <TextField
        value={speaker.name}
        inputProps={{
          'aria-label': 'speaker name',
        }}
        label="Speaker Name"
        fullWidth
        onChange={onChangeStringHandler(setSpeaker('name'))}
      />
      <CKEditor editor={ClassicEditor} data={speaker.text} onChange={save} />
      <ImagePreviewContainer>
        <UploadButton variant="outlined" color="primary">
          <UploadButtonLabel htmlFor={imageUploadId}>Upload</UploadButtonLabel>
        </UploadButton>
        <input
          id={imageUploadId}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          hidden
          aria-label="image input"
        />
        <UploadedImage image={image} remove={removeImage} speaker={speaker} />
      </ImagePreviewContainer>
      <RemoveSpeakerButton
        fullWidth
        variant="outlined"
        aria-label="remove speaker"
        onClick={remove}
      >
        REMOVE SPEAKER
      </RemoveSpeakerButton>
    </>
  )
}

function UploadedImage(props: {
  image: File | null
  speaker: Speaker | null
  remove: () => void
}) {
  if (!props.image && !props.speaker?.image) {
    return null
  }

  const data = props.image
    ? URL.createObjectURL(props.image)
    : props.speaker?.image_url

  return (
    <ImagePreview>
      <img src={data} alt={props.image?.name || props.speaker?.name}></img>
      <Button onClick={props.remove} variant="outlined" size="small">
        clear
      </Button>
    </ImagePreview>
  )
}

const UploadButton = withStyles({
  root: {
    padding: 0,
  },
})(Button)

const UploadButtonLabel = styled.label`
  padding: 5px 15px;
  cursor: pointer;
`

const ImagePreviewContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing[3]};
`

const ImagePreview = styled.div`
  width: 200px;
  margin-top: ${(props) => props.theme.spacing[3]};

  img {
    width: 100%;
    max-height: 100%;
  }
`

const RemoveSpeakerButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
