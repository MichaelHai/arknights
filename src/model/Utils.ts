import {CharacterData} from '@/store';
import _ from 'lodash';
import {Skills} from '@/model/index';

export function targetAchieved(agentData: CharacterData) {
  const current = {
    level: agentData.level,
    phase: agentData.phase,
    allSkillLevel: agentData.allSkillLevel,
    skillLevel: agentData.skillLevel,
  };
  return _.isEqual(current, agentData.planned);
}
