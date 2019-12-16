import {Component, Vue} from 'vue-property-decorator';
import {Skills} from '@/model';
import {mixins} from 'vue-class-component';
import SkillSupport from '@/components/mixins/SkillSupport';

@Component
export default class ImageHelper extends mixins(SkillSupport) {
  protected characterAvatar(characterId: string): string {
    try {
      return require(`@/assets/characters/${characterId}/avatar.png`);
    } catch (e) {
      console.error(`${characterId}'s avatar not found`);
      return require('@/assets/characters/fallback_avatar.png');
    }
  }

  protected skillIcon(skillId: string): string {
    try {
      return require(`@/assets/skills/${this.skillDetail(skillId).iconId || skillId}.png`);
    } catch (e) {
      console.error(`${skillId}'s icon not found`);
      return require('@/assets/skills/fallback_skill.png');
    }
  }

  protected characterBackground(characterId: string): string {
    try {
      return require(`@/assets/characters/${characterId}/background.png`);
    } catch (e) {
      console.error(`${characterId}'s background not found`);
      return require('@/assets/characters/fallback_background.png');
    }
  }

  protected phaseIcon(phase: number): string {
    return require(`@/assets/meta/phase_${phase}.png`);
  }
}
