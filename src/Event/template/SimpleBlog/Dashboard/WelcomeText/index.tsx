import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import React from 'react'
import styled from 'styled-components'

export const WELCOME_TEXT = 'Welcome Text'
export default function WelcomeText() {
  const {welcomeText} = useTemplate()
  return <Text aria-label="welcome">{welcomeText}</Text>
}

const Text = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
