import React from 'react'

import Box from '@material-ui/core/Box'

export default function Centered(props: {
  children: React.ReactElement | React.ReactNode[]
}) {
  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      top="0"
      left="0"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <div>{props.children}</div>
    </Box>
  )
}
