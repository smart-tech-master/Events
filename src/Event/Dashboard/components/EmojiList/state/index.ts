import {EventAction, ClickedEmoji, SEND_EMOJI_ACTION} from 'Event/state/actions'

export const defaultState: ClickedEmoji = {
  id: null,
  name: null,
}

export function clickedEmojiReducer(
  state: ClickedEmoji = defaultState,
  action: EventAction,
) {
  switch (action.type) {
    case SEND_EMOJI_ACTION: {
      return {...action.payload}
    }
    default: {
      return state
    }
  }
}
