import {CharacterData} from '@/store';
import _ from 'lodash';
import moment from 'moment-timezone';
import {Moment} from 'moment-timezone/moment-timezone';

export function targetAchieved(agentData: CharacterData) {
  const current = {
    level: agentData.level,
    phase: agentData.phase,
    allSkillLevel: agentData.allSkillLevel,
    skillLevel: agentData.skillLevel,
  };
  return _.isEqual(current, agentData.planned);
}

const devDayShift = 0;
export function currentDay(): Moment {
  return moment(new Date().getTime() - 4 * 60 * 60 * 1000 + devDayShift * 24 * 60 * 60 * 1000).tz('Asia/Shanghai');
}
