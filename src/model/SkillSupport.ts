import {Component, Vue} from 'vue-property-decorator';
import {SkillDetail, Skills} from '@/model/index';

@Component
export default class SkillSupport extends Vue {
  protected skillDetail(skillId: string): SkillDetail {
    return Skills[skillId];
  }

  protected skillName(skillId: string, level: number): string {
    return this.skillDetail(skillId).levels[level].name;
  }
}
