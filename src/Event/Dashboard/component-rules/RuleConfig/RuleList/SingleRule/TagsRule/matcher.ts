import {Tags} from 'Event/attendee'
import {
  DOES_NOT_INCLUDE,
  TagsRule,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'

export function matchesTagsRule(tags: Tags, rule: TagsRule) {
  if (rule.type === DOES_NOT_INCLUDE) {
    return !tags.includes(rule.target)
  }

  return tags.includes(rule.target)
}
