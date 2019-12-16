import {Component, Vue} from 'vue-property-decorator';
import {SkillDetail, Skills} from '@/model';
import {CharacterData} from '@/store';

@Component
export default class SkillSupport extends Vue {
  protected skillDetail(skillId: string): SkillDetail {
    return Skills[skillId];
  }

  protected skillName(skillId: string, characterData: CharacterData): string {
    const level = characterData.skillLevel[skillId] + characterData.allSkillLevel;
    return this.skillDetail(skillId).levels[level].name;
  }
}
