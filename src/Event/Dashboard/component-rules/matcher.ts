import {AND, OR, Rule} from 'Event/Dashboard/component-rules'
import {matchesTagsRule} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule/matcher'
import {NESTED_RULE} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import {GROUP} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import {matchesGroupRule} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule/matcher'
import {TAGS} from 'Event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import {Groups, Tags} from 'Event/attendee'

export const hasMatch = (
  {groups = {}, tags = []}: {groups?: Groups; tags?: Tags},
  rules: Rule[],
): boolean =>
  rules.reduce((alreadyMatched: boolean, r: Rule, i: number) => {
    const isMatch = isTrue(groups, tags, r)
    switch (r.condition) {
      case AND:
        const isFirst = i === 0
        return isFirst ? isMatch : alreadyMatched && isMatch
      case OR:
        return alreadyMatched || isMatch
      default:
        throw new Error(`Unimplemented rule operator: ${r.condition}`)
    }
  }, false)

function isTrue(groups: Groups, tags: Tags, r: Rule) {
  switch (r.source) {
    case NESTED_RULE:
      return hasMatch({groups, tags}, r.rules)
    case GROUP:
      return matchesGroupRule(groups, r)
    case TAGS:
      return matchesTagsRule(tags, r)
  }
}
