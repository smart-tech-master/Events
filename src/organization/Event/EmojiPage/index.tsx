import styled from 'styled-components'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import ClickedEmoji, {
  createEmoji,
  Emoji,
} from 'organization/Event/EmojiPage/ClickedEmoji'
import {useInterval} from 'lib/interval'

export type Emojis = string[]

const POLL_INTERVAL_MS = 1000

export default function EmojiPage() {
  const [emojis, setEmojis] = useState<Emoji[]>([])
  const fetchEmojis = useFetchEmojis()
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useInterval(() => {
    fetchEmojis()
      .then((images) => {
        if (!isMountedRef.current) {
          return
        }

        const newEmojis = images.map(createEmoji)
        // Use setState's callback version to make sure
        // we always have latest state.
        setEmojis((current) => [...current, ...newEmojis])
      })
      .catch((error) => {
        // ignore errors, prevent failing to send emoji from crashing app
        console.error(error)
      })
  }, POLL_INTERVAL_MS)

  const remove = useCallback((target: Emoji) => {
    setEmojis((current) => current.filter((e) => e.id !== target.id))
  }, [])

  return (
    <Container>
      {emojis.map((emoji) => {
        return <ClickedEmoji emoji={emoji} key={emoji.id} onComplete={remove} />
      })}
    </Container>
  )
}

function useFetchEmojis() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/emoji_page`)

  return () => client.get<Emojis>(url)
}

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background: #000000;
  position: absolute;
  overflow: hidden;
`
