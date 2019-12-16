import {Component, Vue} from 'vue-property-decorator';

@Component
export default class WarehouseSupport extends Vue {
  protected warehouseAmount(itemId: string): number {
    return this.$store.state.itemCounts[itemId] || 0;
  }
}
