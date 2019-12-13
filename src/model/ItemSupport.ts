import {Component, Vue} from 'vue-property-decorator';
import {ItemDetail, Items} from '@/model/index';

@Component
export default class ItemSupport extends Vue {
  protected itemDetail(id: string): ItemDetail {
    return Items[id];
  }

  protected itemIcon(id: string): string {
    try {
      return require(`@/assets/items/${this.itemDetail(id).iconId}.png`);
    } catch (e) {
      console.error(`${id}'s icon not found`);
      return require('@/assets/items/fallback_icon.png');
    }
  }
}
