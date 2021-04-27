import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {ComponentConfig} from 'Event/Dashboard/editor/views/DashboardEditDialog/ComponentConfig'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export const useEditMode = () =>
  useSelector((state: RootState) => state.editor.isEditMode)

export const useIsSaving = () =>
  useSelector((state: RootState) => state.editor.isSaving)

export function useCurrent<T>(
  currentSelector: (state: RootState) => T | undefined,
  saved: T,
) {
  const current = useSelector(currentSelector)
  const isEditMode = useEditMode()

  // If dashboard not loaded, or does not contain component,
  // value will be undefined. This is different from
  // 'null'/false/0 case, which are valid values.
  if (!isEditMode || current === undefined) {
    return saved
  }

  return current
}

export function useCloseConfig() {
  const dispatch = useDispatch()
  return () => {
    dispatch(setConfig(null))
  }
}

export function useEditComponent(component: ComponentConfig) {
  const dispatch = useDispatch()

  return () => {
    dispatch(setConfig(component))
  }
}
