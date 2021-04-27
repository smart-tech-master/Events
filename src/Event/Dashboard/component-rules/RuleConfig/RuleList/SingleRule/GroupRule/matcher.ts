import {Groups} from 'Event/attendee'

import {
  GroupRule,
  IS_NOT,
} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'

export function matchesGroupRule(groups: Groups, rule: GroupRule) {
  if (rule.type === IS_NOT) {
    return groups[rule.key] !== rule.target
  }

  return groups[rule.key] === rule.target
}
