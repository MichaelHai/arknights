import {Component} from 'vue-property-decorator';
import StageTable from '@/assets/ArknightsGameData/excel/stage_table.json';
import {ItemType} from '@/model';
import {mixins} from 'vue-class-component';
import ItemSupport from '@/components/mixins/ItemSupport';

export interface StageDetail {
  stageId: string;
  code: string;
  name: string | null;
  stageDropInfo: {
    displayDetailRewards: Array<Reward>
  };
}

export interface Reward {
  type: RewardType;
  id: string;
}

export enum RewardType {
  CHAR = 'CHAR',
  TKT_RECRUIT = 'TKT_RECRUIT',
  CARD_EXP = 'CARD_EXP',
  DIAMOND = 'DIAMOND',
  MATERIAL = 'MATERIAL',
}

@Component
export default class StageSupport extends mixins(ItemSupport) {
  protected getStageDetail(stageId: string): StageDetail {
    const stages: { [id: string]: StageDetail } = StageTable.stages as { [id: string]: StageDetail };
    return stages[stageId] as StageDetail;
  }

  protected getStageMaterialRewards(stageId: string): Array<string> {
    const allRwards = this.getStageDetail(stageId).stageDropInfo.displayDetailRewards
      .filter((reward) => reward.type !== RewardType.CHAR)
      .map((reward) => reward.id);
    return this.filterMaterialItems([...new Set(allRwards)]);
  }
}
