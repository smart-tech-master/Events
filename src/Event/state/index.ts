import {ObvioEvent} from 'Event'
import {
  EventAction,
  handleCreateTemplate,
  handleSetEvent,
  handleCreateSpeaker,
  handleUpdateSpeakers,
  handleRemoveSpeaker,
  handleUpdateTemplate,
  handleUpdateSpeakerPageTitle,
  CREATE_TEMPLATE_ACTION,
  SET_EVENT_ACTION,
  UPDATE_TEMPLATE_ACTION,
  UPDATE_SPEAKER_ACTION,
  CREATE_SPEAKER_ACTION,
  REMOVE_SPEAKER_ACTION,
  UPDATE_SPEAKER_PAGE_TITLE_ACTION,
} from 'Event/state/actions'

export type EventState = ObvioEvent | null

export function eventReducer(state: EventState = null, action: EventAction) {
  switch (action.type) {
    case SET_EVENT_ACTION: {
      return handleSetEvent(state, action)
    }
    case CREATE_TEMPLATE_ACTION: {
      return handleCreateTemplate(state, action)
    }
    case UPDATE_TEMPLATE_ACTION: {
      return handleUpdateTemplate(state, action)
    }
    case CREATE_SPEAKER_ACTION: {
      return handleCreateSpeaker(state, action)
    }
    case UPDATE_SPEAKER_ACTION: {
      return handleUpdateSpeakers(state, action)
    }
    case REMOVE_SPEAKER_ACTION: {
      return handleRemoveSpeaker(state, action)
    }
    case UPDATE_SPEAKER_PAGE_TITLE_ACTION: {
      return handleUpdateSpeakerPageTitle(state, action)
    }
    default: {
      return state
    }
  }
}
