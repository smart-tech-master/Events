import {Epic, ofType} from 'redux-observable'
import {RootState} from 'store'
import {mapTo, debounceTime, switchMap} from 'rxjs/operators'
import {api} from 'lib/url'
import {setSaving} from 'Event/Dashboard/editor/state/actions'
import {of, concat} from 'rxjs'
import {AjaxCreationMethod} from 'rxjs/internal/observable/dom/AjaxObservable'
import {SendEmojiAction, SEND_EMOJI_ACTION} from 'Event/state/actions'

export const sendEmojiEpic: Epic<
  SendEmojiAction,
  any,
  RootState,
  {ajax: AjaxCreationMethod}
> = (action$, state$, {ajax}) =>
  action$.pipe(
    ofType<SendEmojiAction>(SEND_EMOJI_ACTION),
    debounceTime(1000),
    switchMap(() => {
      const {clickedEmoji, event, auth} = state$.value
      if (!event) {
        throw new Error('Missing event, was it set properly in EventProvider?')
      }

      const url = api(`/emoji/sendEmoji`)
      //   Use dependencies.ajax to allow injecting mock ajax for tests
      const request = ajax.post(
        url,
        {
          ...event,
          emoji_id: clickedEmoji.id,
          emoji_name: clickedEmoji.name,
        },
        {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json', // Avoid rxjs from serializing data into [object, object]
        },
      )

      // Set saving status after request completes
      return concat(of(setSaving(true)), request.pipe(mapTo(setSaving(false))))
    }),
  )
