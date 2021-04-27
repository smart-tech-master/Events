import {useTemplate} from 'Event/Speakers/state/TemplateProvider'
import React from 'react'
import styled from 'styled-components'

export const SPEAKERS_TITLE = 'Speakers'
export default function MainTitle() {
  const {title} = useTemplate()
  return <Text aria-label="speakers">{title}</Text>
}

const Text = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
