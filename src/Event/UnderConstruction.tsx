import React from 'react'
import styled from 'styled-components'

export default function UnderConstruction() {
  return (
    <UnderConstructionContainer>
      <DescriptionHeader aria-label="event under contruction">
        Under Construction
      </DescriptionHeader>
      <Description>
        The site is under construction now. Please come back later.
      </Description>
    </UnderConstructionContainer>
  )
}

const UnderConstructionContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: black;
  color: white;
  min-height: 100%;
`

const DescriptionHeader = styled.div`
  font-size: 4vw;
`

const Description = styled.div`
  font-size: 2vw;
`
