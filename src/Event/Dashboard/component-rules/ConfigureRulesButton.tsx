import React from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'

export default function ConfigureRulesButton(props: {onClick: () => void}) {
  return (
    <Box>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={props.onClick}
      >
        Visibility Rules
      </Button>
    </Box>
  )
}

const Box = styled.div`
  text-align: right;
`
