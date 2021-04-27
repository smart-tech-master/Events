import {DashboardEditorState} from 'Event/Dashboard/editor/state'
import {ComponentConfig} from 'Event/Dashboard/editor/views/DashboardEditDialog/ComponentConfig'

export const SET_EDIT_MODE = 'SET_EDIT_MODE'
export interface SetEditModeAction {
  type: typeof SET_EDIT_MODE
  payload: boolean
}
export const setEditMode = (isEdit: boolean): SetEditModeAction => ({
  type: SET_EDIT_MODE,
  payload: isEdit,
})
export const handleSetEditMode = (
  state: DashboardEditorState,
  action: SetEditModeAction,
): DashboardEditorState => ({
  ...state,
  isEditMode: action.payload,
})

export const SET_CONFIG_ACTION = 'SET_CONFIG'
export interface SetConfigAction {
  type: typeof SET_CONFIG_ACTION
  payload: ComponentConfig | null
}
export const setConfig = (config: ComponentConfig | null): SetConfigAction => ({
  type: SET_CONFIG_ACTION,
  payload: config,
})
export const handleSetConfig = (
  state: DashboardEditorState,
  action: SetConfigAction,
) => {
  return {
    ...state,
    config: action.payload,
  }
}

export const SET_SAVING_ACTION = 'SET_SAVING_DASHBOARD'
export interface SetSavingAction {
  type: typeof SET_SAVING_ACTION
  payload: boolean
}
export const setSaving = (isSaving: boolean): SetSavingAction => ({
  type: SET_SAVING_ACTION,
  payload: isSaving,
})
export const handlesetSaving = (
  state: DashboardEditorState,
  action: SetSavingAction,
): DashboardEditorState => ({
  ...state,
  isSaving: action.payload,
})

export type EditorAction = SetEditModeAction | SetConfigAction | SetSavingAction
