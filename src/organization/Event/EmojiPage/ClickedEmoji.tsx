import styled from 'styled-components'
import React, {useEffect} from 'react'
import {v4 as uuid} from 'uuid'
import {emojiWithName} from 'Event/Dashboard/components/EmojiList/emoji'

const DEFAULT_SIZE: number = 68

export type Emoji = {
  id: string
  content: string
  duration: number
  size: number
}

interface ClickedEmojiProps {
  emoji: Emoji
  onComplete: (emoji: Emoji) => void
}

// Memoize ClickedEmoji to prevent re-renders from
// interrupting animation
export default React.memo<ClickedEmojiProps>(ClickedEmoji, (prev, next) => {
  return prev.emoji.id === next.emoji.id
})

function ClickedEmoji(props: ClickedEmojiProps) {
  const {emoji, onComplete} = props
  const durationMs = emoji.duration * 1000

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(emoji)
    }, durationMs)

    return () => {
      clearTimeout(timer)
    }
  }, [emoji, durationMs, onComplete])

  const position = Math.random() * 80 + 10
  const size = emoji.size * DEFAULT_SIZE

  return (
    <Box duration={emoji.duration} position={position} size={size}>
      <img
        aria-label="emoji"
        src={emojiWithName(emoji.content).image}
        alt={emoji.content}
      />
    </Box>
  )
}

export const createEmoji = (image: string): Emoji => ({
  id: uuid(),
  content: image,
  duration: Math.random() * 10 + 1,
  size: Math.random() + 1,
})

const Box = styled.div<{duration: number; position: number; size: number}>`
  position: absolute;
  animation: animateBubble ${(props) => props.duration}s linear forwards,
    sideWays 1s ease-in-out infinite alternate;
  left: ${(props) => props.position}%;
  width: ${(props) => props.position}px;
  height: ${(props) => props.position}px;

  @keyframes animateBubble {
    0% {
      top: calc(100% + 200px);
    }
    100% {
      top: -200px;
    }
  }

  @keyframes sideWays {
    0% {
      margin-left: -50px;
    }
    100% {
      margin-left: 50px;
    }
  }
`
