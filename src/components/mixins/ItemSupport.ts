import {Component} from 'vue-property-decorator';
import {CostItem, ItemBuildingProduct, ItemClassifyType, ItemDetail, ItemType} from '@/model';
import MasterData from '@/assets/master-data.json';
import {mixins} from 'vue-class-component';
import BuildingSupport from '@/components/mixins/BuildingSupport';
import ItemTable from '@/assets/ArknightsGameData/zh_CN/gamedata/excel/item_table.json';

@Component
export default class ItemSupport extends mixins(BuildingSupport) {
  private Items: { [id: string]: ItemDetail } = ItemTable.items as { [id: string]: ItemDetail };

  protected get AllMaterials(): Array<string> {
    return this.filterMaterialItems(Object.keys(this.Items));
  }

  protected filterMaterialItems(items: Array<string>): Array<string> {
    return items.map((item) => this.itemDetail(item))
      .filter((item) => item.itemType === ItemType.MATERIAL)
      .filter((item) => item.classifyType === ItemClassifyType.MATERIAL)
      .filter((item) => !item.itemId.startsWith('tier')) // 通用信物
      .filter((item) => !item.itemId.startsWith('p_char_')) // 信物
      .sort((item1, item2) => item1.sortId - item2.sortId)
      .map((item) => item.itemId);
  }

  protected itemDetail(id: string): ItemDetail {
    return this.Items[id];
  }

  protected itemIcon(id: string): string {
    try {
      return require(`@/assets/items/${this.itemDetail(id).iconId}.png`);
    } catch (e) {
      console.error(`${id}'s icon not found`);
      return require('@/assets/items/fallback_icon.png');
    }
  }

  protected getItemSuggestion(id: string): ItemSuggestion {
    const suggestions: { [id: string]: ItemSuggestion } = MasterData['item-suggestions'] as { [id: string]: ItemSuggestion };
    return suggestions[id] as ItemSuggestion;
  }

  protected getCompositeItems(id: string): Array<CostItem> {
    const buildingProduct: Array<ItemBuildingProduct> = this.itemDetail(id).buildingProductList;
    if (buildingProduct.length > 0) {
      return this.getBuildingFormulas(buildingProduct[0].formulaId, buildingProduct[0].roomType).costs;
    } else {
      return [];
    }
  }

  protected getProduceCount(id: string): number {
    const buildingProduct: Array<ItemBuildingProduct> = this.itemDetail(id).buildingProductList;
    if (buildingProduct.length > 0) {
      return this.getBuildingFormulas(buildingProduct[0].formulaId, buildingProduct[0].roomType).count;
    } else {
      return 0;
    }
  }
}

export type ItemSuggestion = 'composite' | Array<string>;
