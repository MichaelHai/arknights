import {Component, Vue} from 'vue-property-decorator';
import {CostItem, ItemType} from '@/model';
import {Moment} from 'moment-timezone/moment-timezone';
import CheckinTable from '@/assets/ArknightsGameData/zh_CN/gamedata/excel/checkin_table.json';

@Component
export default class CheckinSupport extends Vue {
  private get CheckinGroups(): { [id: string]: CheckinGroup } {
    return CheckinTable.groups as { [id: string]: CheckinGroup };
  }

  protected getCheckin(day: Moment): CostItem | null {
    const epoch = day.toDate().getTime() / 1000;
    const date = day.date();
    const group: CheckinGroup | undefined = Object.values(this.CheckinGroups)
      .find((group) => group.signStartTime <= epoch && group.signEndTime >= epoch);
    if (group) {
      const itemCount: ItemCount = group.items[date - 1];
      if (itemCount) {
        return {
          id: itemCount.itemId,
          count: itemCount.count,
          type: itemCount.itemType,
        };
      }
    }

    return null;
  }
}

export interface CheckinGroup {
  groupId: string;
  signStartTime: number;
  signEndTime: number;
  items: Array<ItemCount>;
}

export interface ItemCount {
  itemId: string;
  itemType: ItemType;
  count: number;
}
