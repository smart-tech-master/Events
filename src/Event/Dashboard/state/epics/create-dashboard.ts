import {Epic, ofType} from 'redux-observable'
import {RootState} from 'store'
import {mapTo, switchMap} from 'rxjs/operators'
import {api} from 'lib/url'
import {setSaving} from 'Event/Dashboard/editor/state/actions'
import {of, concat} from 'rxjs'
import {AjaxCreationMethod} from 'rxjs/internal/observable/dom/AjaxObservable'
import {CreateTemplateAction, CREATE_TEMPLATE_ACTION} from 'Event/state/actions'
import {jsonHeader, put} from 'lib/api-client'

export const createDashboardEpic: Epic<
  CreateTemplateAction,
  any,
  RootState,
  {ajax: AjaxCreationMethod}
> = (action$, state$, {ajax}) =>
  action$.pipe(
    ofType<CreateTemplateAction>(CREATE_TEMPLATE_ACTION),
    mapTo(setSaving(true)),
    switchMap(() => {
      const {event, auth} = state$.value
      if (!event) {
        throw new Error('Missing event, was it set properly in EventProvider?')
      }

      const url = api(`/events/${event.slug}`)

      const request = ajax.post(url, put(event), jsonHeader(auth.token))

      return concat(of(setSaving(true)), request.pipe(mapTo(setSaving(false))))
    }),
  )
