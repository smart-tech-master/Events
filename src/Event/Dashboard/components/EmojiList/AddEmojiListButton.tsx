import {Button} from '@material-ui/core'
import {EMOJI_LIST} from 'Event/Dashboard/components/EmojiList'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import React from 'react'
import {useDispatch} from 'react-redux'

export default function AddEmojiListButton(props: {className?: string}) {
  const dispatch = useDispatch()

  const addEmojiList = () => {
    dispatch(
      setConfig({
        type: EMOJI_LIST,
      }),
    )
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add emoji list"
      onClick={addEmojiList}
      className={props.className}
    >
      Add Emoji
    </Button>
  )
}
