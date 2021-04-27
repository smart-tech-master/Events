import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {Emoji} from 'Event/Dashboard/components/EmojiList/emoji'
import {onUnknownChangeHandler} from 'lib/dom'
import React from 'react'

export default function EmojiSelect(props: {
  value?: Emoji['name']
  onPick: (emoji: string) => void
  emojis: Emoji[]
}) {
  return (
    <FormControl fullWidth>
      <InputLabel>Pick an emoji</InputLabel>
      <Select
        value={props.value}
        fullWidth
        onChange={onUnknownChangeHandler(props.onPick)}
        inputProps={{
          'aria-label': 'pick emoji',
        }}
      >
        {props.emojis.map((emoji, index) => {
          return (
            <MenuItem key={index} value={emoji.name}>
              <Image src={emoji.image} alt={emoji.name} />
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

const Image = styled.img`
  width: 30px;
`
