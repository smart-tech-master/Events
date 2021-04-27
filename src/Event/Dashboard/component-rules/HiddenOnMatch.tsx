import {Rule} from 'Event/Dashboard/component-rules'
import {hasMatch} from 'Event/Dashboard/component-rules/matcher'
import {useAttendeeProfile} from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function HiddenOnMatch(props: {
  rules: Rule[]
  children: React.ReactElement
}) {
  const {groups, tags} = useAttendeeProfile()
  const isEditMode = useEditMode()

  if (isEditMode) {
    // Always show in edit mode or it would
    // be pretty difficult to configure a hidden component.
    return props.children
  }

  const hide = hasMatch({groups, tags}, props.rules)
  if (hide) {
    return null
  }

  return props.children
}
