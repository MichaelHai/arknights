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
      return require('@/assets/items/fallback_icon.png');
    }
  }

  protected characterImage(characterId: string, skin: string = 'init'): string | null {
    try {
      return require(`@/assets/characters/${characterId}/${skin}.png`);
    } catch (e) {
      console.error(`${characterId}'s image not found`);
      return null;
    }
  }

  protected characterLogo(logo: string): string | null {
    try {
      return require(`@/assets/characters/logos/${logo}.png`);
    } catch (e) {
      console.error(`Logo ${logo} is not found`);
      return null;
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
      return require('@/assets/characters/background.png');
    }
  }

  protected phaseIcon(phase: number): string {
    return require(`@/assets/meta/phase_${phase}.png`);
  }
}
