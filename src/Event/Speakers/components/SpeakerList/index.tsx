import React from 'react'
import styled from 'styled-components'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddSpeakerButton from 'Event/Speakers/components/SpeakerList/AddSpeakerButton'
import {useTemplate} from 'Event/Speakers/state/TemplateProvider'
import {Speaker} from 'Event'

export const SPEAKER = 'Speaker'

export default function SpeakerList() {
  const speakerTemplate = useTemplate()

  let {speakers} = speakerTemplate

  if (!speakers) {
    speakers = []
  }

  const hasSpeaker = speakers?.length > 0
  if (!hasSpeaker) {
    return (
      <EditModeOnly>
        <StyledAddSpeakerButton />
      </EditModeOnly>
    )
  }

  return (
    <>
      {speakers.map((speaker, index) => (
        <EditComponent component={{type: SPEAKER, id: index}} key={index}>
          <SpeakerContent speaker={speaker} />
        </EditComponent>
      ))}
      <EditModeOnly>
        <StyledAddSpeakerButton />
      </EditModeOnly>
    </>
  )
}

function SpeakerContent(props: {speaker: Speaker}) {
  const {speaker} = props
  const {image, name, text, image_url: imageUrl} = speaker
  const data =
    image && typeof image !== 'string' ? URL.createObjectURL(image) : null

  return (
    <SpeakerItem aria-label="speaker">
      <Image image={imageUrl || data} alt={name} />
      <TextWrapper>
        <Name>{name}</Name>
        <div
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      </TextWrapper>
    </SpeakerItem>
  )
}

function Image(props: {image: string | null; alt: string}) {
  return (
    <ImagePreview>
      <img
        src={props.image || 'http://placehold.jp/200x200.png'}
        alt={props.alt}
      ></img>
    </ImagePreview>
  )
}

const SpeakerItem = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const TextWrapper = styled.div`
  margin-left: 20px;
`

const Name = styled.p`
  text-transform: capitalize;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`

const ImagePreview = styled.div`
  width: 200px;

  img {
    width: 100%;
    max-height: 100%;
  }
`

const StyledAddSpeakerButton = styled(AddSpeakerButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
