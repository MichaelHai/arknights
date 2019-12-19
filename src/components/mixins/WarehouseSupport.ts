import {Component, Vue} from 'vue-property-decorator';
import {Mutations} from '@/store';

@Component
export default class WarehouseSupport extends Vue {
  protected warehouseAmount(itemId: string): number {
    return this.$store.state.itemCounts[itemId] || 0;
  }

  protected changeItem(item: string, amount: number) {
    return this.$store.commit(Mutations.ChangeItem, {
      item,
      amount,
    });
  }
}
