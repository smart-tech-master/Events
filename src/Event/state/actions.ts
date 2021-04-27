import {createSimpleBlog} from './../template/SimpleBlog/index'
import {ObvioEvent, Speaker} from 'Event'
import {EventState} from 'Event/state'
import {Template} from 'Event/template'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

export const SET_EVENT_ACTION = 'SET_EVENT'
export interface SetEventAction {
  type: typeof SET_EVENT_ACTION
  payload: ObvioEvent | null
}
export const setEvent = (Event: ObvioEvent | null): SetEventAction => ({
  type: SET_EVENT_ACTION,
  payload: Event,
})
export const handleSetEvent = (
  state: EventState,
  action: SetEventAction,
): EventState => {
  return action.payload
}

export const CREATE_TEMPLATE_ACTION = 'CREATE_TEMPLATE'
export interface CreateTemplateAction {
  type: typeof CREATE_TEMPLATE_ACTION
  payload: Template['name']
}
export const createTemplate = (
  template: Template['name'],
): CreateTemplateAction => ({
  type: CREATE_TEMPLATE_ACTION,
  payload: template,
})
export const handleCreateTemplate = (
  state: EventState,
  action: CreateTemplateAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }

  const template = newTemplate(action.payload)
  return {
    ...state,
    template,
  }
}
function newTemplate(name: Template['name']) {
  switch (name) {
    case SIMPLE_BLOG:
      return createSimpleBlog()
  }
}

export const UPDATE_TEMPLATE_ACTION = 'UPDATE_TEMPLATE'
export interface UpdateTemplateAction {
  type: typeof UPDATE_TEMPLATE_ACTION
  payload: Partial<Template>
}
export const updateTemplte = (
  updates: Partial<Template>,
): UpdateTemplateAction => ({
  type: UPDATE_TEMPLATE_ACTION,
  payload: updates,
})
export const handleUpdateTemplate = (
  state: EventState,
  action: UpdateTemplateAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }

  if (!state.template) {
    throw new Error('Template missing; create one before updating')
  }

  return {
    ...state,
    template: {
      ...state.template,
      ...action.payload,
    },
  }
}

export const UPDATE_SPEAKER_PAGE_TITLE_ACTION =
  'UPDATE_SPEAKER_PAGE_TITLE_ACTION'
export interface UpdateSpeakerPageTitleAction {
  type: typeof UPDATE_SPEAKER_PAGE_TITLE_ACTION
  payload: string
}
export const updateSpeakerPageTitle = (
  title: string,
): UpdateSpeakerPageTitleAction => ({
  type: UPDATE_SPEAKER_PAGE_TITLE_ACTION,
  payload: title,
})
export const handleUpdateSpeakerPageTitle = (
  state: EventState,
  action: UpdateSpeakerPageTitleAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }

  const title = action.payload
  let {speaker_page: speakerPage} = state

  if (!speakerPage) {
    speakerPage = {title, speakers: []}
  } else {
    speakerPage.title = title
  }

  return {
    ...state,
    speaker_page: speakerPage,
  }
}

export const UPDATE_SPEAKER_ACTION = 'UPDATE_SPEAKER_ACTION'
export interface UpdateSpeakerAction {
  type: typeof UPDATE_SPEAKER_ACTION
  payload: Speaker
}
export const updateSpeaker = (updates: Speaker): UpdateSpeakerAction => ({
  type: UPDATE_SPEAKER_ACTION,
  payload: updates,
})
export const handleUpdateSpeakers = (
  state: EventState,
  action: UpdateSpeakerAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }

  const speaker = action.payload
  const {speaker_page: speakerPage} = state
  if (!speakerPage) {
    throw new Error('Missing speaker page config; was it set in the store?')
  }
  const {speakers} = speakerPage
  if (speakers) {
    const findIndex = speakers.findIndex((item) => item.id === speaker.id)
    speakers.splice(findIndex, 1, speaker)
  }

  return {
    ...state,
    speaker_page: speakerPage,
  }
}

export const CREATE_SPEAKER_ACTION = 'CREATE_SPEAKER_ACTION'
export interface CreateSpeakerAction {
  type: typeof CREATE_SPEAKER_ACTION
  payload: Speaker
}
export const createSpeaker = (template: Speaker): CreateSpeakerAction => ({
  type: CREATE_SPEAKER_ACTION,
  payload: template,
})
export const handleCreateSpeaker = (
  state: EventState,
  action: CreateSpeakerAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }

  const {speaker_page: speakerPage} = state
  if (!speakerPage) {
    throw new Error('Missing speaker page config; was it set in the store?')
  }

  const speaker = action.payload

  let {speakers} = speakerPage
  if (!speakers) {
    speakers = [speaker]
  } else {
    speakers.push(speaker)
  }

  speakerPage.speakers = speakers

  return {
    ...state,
    speaker_page: speakerPage,
  }
}

export const REMOVE_SPEAKER_ACTION = 'REMOVE_SPEAKER_ACTION'
export interface RemoveSpeakerAction {
  type: typeof REMOVE_SPEAKER_ACTION
  payload: number
}
export const removeSpeaker = (id: number): RemoveSpeakerAction => ({
  type: REMOVE_SPEAKER_ACTION,
  payload: id,
})
export const handleRemoveSpeaker = (
  state: EventState,
  action: RemoveSpeakerAction,
): EventState => {
  if (!state) {
    throw new Error('Missing event; was it set in the store?')
  }
  const {speaker_page: speakerPage} = state
  if (!speakerPage) {
    throw new Error('Missing speaker page config; was it set in the store?')
  }

  const id = action.payload

  const {speakers} = speakerPage
  if (!speakers) {
    throw new Error('Missing speakers; was it set in the store?')
  }
  const without = speakers.filter((speaker) => speaker.id !== id)
  speakerPage.speakers = without

  return {
    ...state,
    speaker_page: speakerPage,
  }
}
export interface ClickedEmoji {
  id: number | null
  name: string | null
}

export const SEND_EMOJI_ACTION = 'SEND_EMOJI'
export interface SendEmojiAction {
  type: typeof SEND_EMOJI_ACTION
  payload: ClickedEmoji
}

export const sendEmoji = (emoji: ClickedEmoji): SendEmojiAction => ({
  type: SEND_EMOJI_ACTION,
  payload: emoji,
})

export type EventAction =
  | SetEventAction
  | CreateTemplateAction
  | CreateSpeakerAction
  | UpdateSpeakerAction
  | RemoveSpeakerAction
  | UpdateTemplateAction
  | SendEmojiAction
  | UpdateSpeakerPageTitleAction
