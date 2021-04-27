import {
  EditorAction,
  handleSetConfig,
  handleSetEditMode,
  handlesetSaving,
  SET_CONFIG_ACTION,
  SET_EDIT_MODE,
  SET_SAVING_ACTION,
} from 'Event/Dashboard/editor/state/actions'
import {ComponentConfig} from 'Event/Dashboard/editor/views/DashboardEditDialog/ComponentConfig'

export type DashboardEditorState = {
  config: ComponentConfig | null
  isEditMode: boolean
  isSaving: boolean
}

export const defaultState: DashboardEditorState = {
  config: null,
  isEditMode: false,
  isSaving: false,
}

export function editorReducer(
  state: DashboardEditorState = defaultState,
  action: EditorAction,
) {
  switch (action.type) {
    case SET_EDIT_MODE: {
      return handleSetEditMode(state, action)
    }
    case SET_CONFIG_ACTION: {
      return handleSetConfig(state, action)
    }
    case SET_SAVING_ACTION: {
      return handlesetSaving(state, action)
    }
    default: {
      return state
    }
  }
}
