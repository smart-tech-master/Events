import {authReducer} from 'auth'
import {editorReducer} from 'Event/Dashboard/editor/state'
import {eventReducer} from 'Event/state'
import {clickedEmojiReducer} from 'Event/Dashboard/components/EmojiList/state'
import {
  createStore as createReduxStore,
  applyMiddleware,
  compose,
  combineReducers,
} from 'redux'
import {combineEpics, createEpicMiddleware} from 'redux-observable'
import {AjaxCreationMethod} from 'rxjs/internal/observable/dom/AjaxObservable'
import {ajax as rxJsAjax} from 'rxjs/ajax'
import {dashboardEpics} from 'Event/Dashboard/state/epics'

export const rootReducer = combineReducers({
  editor: editorReducer,
  auth: authReducer,
  event: eventReducer,
  clickedEmoji: clickedEmojiReducer,
})
export type RootState = ReturnType<typeof rootReducer>

// If devtools is enabled, use devtool's compose. Required
// for proper debugging.
const composeWithDevtools =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

type StoreOptions = {
  ajax: AjaxCreationMethod
}

const rootEpic = combineEpics(dashboardEpics)

// Make creating a store a fn to avoid tests sharing the same store. We'll also
// accept dependencies here.
export const createStore = ({ajax}: StoreOptions = {ajax: rxJsAjax}) => {
  const epicMiddleware = createEpicMiddleware<any, any, RootState>({
    dependencies: {
      ajax,
    },
  })

  const store = createReduxStore(
    rootReducer,
    composeWithDevtools(applyMiddleware(epicMiddleware)),
  )
  epicMiddleware.run(rootEpic)

  return store
}
