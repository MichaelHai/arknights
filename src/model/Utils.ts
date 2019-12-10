import {AgentData} from '@/store';
import _ from 'lodash';

export function targetAchieved(agentData: AgentData) {
  const current = {
    level: agentData.level,
    promote: agentData.promote,
    skillLevel: agentData.skillLevel,
    skillSpecialize: agentData.skillSpecialize,
  };
  return _.isEqual(current, agentData.planned);
}
