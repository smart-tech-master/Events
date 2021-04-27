import React, {useCallback, useEffect, useRef, useState} from 'react'
import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import SignaturePad from 'signature_pad'
import {publicAsset} from 'lib/url'
import IconButton from 'lib/ui/IconButton'
import ClearIcon from '@material-ui/icons/Clear'

export default function Signature(props: {
  value: null | string
  onUpdate: (data: string | null) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const {onUpdate} = props
  const hasValue = Boolean(props.value)
  const [pad, setPad] = useState<null | SignaturePad>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error(`Missing canvas el`)
    }

    const pad = new SignaturePad(canvasRef.current)
    setPad(pad)

    pad.onEnd = () => {
      const data = pad.toDataURL()
      onUpdate(data)
    }

    return () => {
      pad.clear()
      pad.off()
      setPad(null)
    }
  }, [onUpdate])

  const clear = useCallback(
    withPad(pad, (pad) => {
      pad.clear()
      onUpdate(null)
    }),
    [pad],
  )

  return (
    <Box>
      <Canvas ref={canvasRef} aria-label="signature canvas" />
      <ClearSignatureButton show={hasValue} clear={clear} />
    </Box>
  )
}

function ClearSignatureButton(props: {show: boolean; clear: () => void}) {
  if (!props.show) {
    return null
  }
  return (
    <ClearButton onClick={props.clear}>
      <ClearIcon htmlColor={grey[500]} />
    </ClearButton>
  )
}

function withPad(
  pad: SignaturePad | null,
  handle: (pad: SignaturePad) => void,
) {
  return () => {
    if (!pad) {
      throw new Error(`Pad has not been set`)
    }
    return handle(pad)
  }
}

const Box = styled.div`
  display: inline-block;
  position: relative;
`

const Canvas = styled.canvas`
  border-width: 2px;
  border-style: dashed;
  border-color: rgb(221, 221, 221);
  background-color: rgb(255, 255, 255);
  cursor: url(${publicAsset('images/pen.cur')}), pointer;
  touch-action: none;
`

const ClearButton = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;
`
