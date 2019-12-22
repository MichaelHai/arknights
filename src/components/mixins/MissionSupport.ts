import MissionTable from '@/assets/ArknightsGameData/excel/mission_table.json';
import {Component, Vue} from 'vue-property-decorator';
import {CostItem, ItemType} from '@/model';
import {mixins} from 'vue-class-component';
import ItemSupport from '@/components/mixins/ItemSupport';
import {Moment} from 'moment-timezone/moment-timezone';

@Component
export default class MissionSupport extends mixins(ItemSupport) {
  private get dailyMissionPeriodInfos(): Array<DailyMissionPeriodInfo> {
    return MissionTable.dailyMissionPeriodInfo as Array<DailyMissionPeriodInfo>;
  }

  private get periodicalRewards(): { [id: string]: PeriodicalRewards } {
    return MissionTable.periodicalRewards as { [id: string]: PeriodicalRewards };
  }

  protected getDailyRewards(day: Moment): Array<Array<CostItem>> {
    const epoch = day.toDate().getTime() / 1000;
    const dailyMissionPeriodInfo = this.dailyMissionPeriodInfos.find((info) => info.startTime <= epoch && info.endTime >= epoch);
    if (dailyMissionPeriodInfo) {
      let currentDay: number = day.weekday();
      if (currentDay === 0) {
        currentDay = 7;
      }
      const dailyMissionRewardPeriod = dailyMissionPeriodInfo.periodList.find((period) => period.period.indexOf(currentDay as Period) >= 0);
      if (dailyMissionRewardPeriod) {
        const rewardGroupId = dailyMissionRewardPeriod.rewardGroupId;
        return Object.values(this.periodicalRewards)
          .filter((reward) => reward.groupId === rewardGroupId)
          .sort((r1, r2) => r1.sortIndex - r2.sortIndex)
          .map((reward) => reward.rewards.filter((reward) => this.AllMaterials.indexOf(reward.id) >= 0))
          .filter((rewards) => rewards.length > 0);
      }
    }

    return [];
  }
}

export interface DailyMissionPeriodInfo {
  startTime: number;
  endTime: number;
  periodList: Array<DailyMissionRewardPeriod>;
}

export interface DailyMissionRewardPeriod {
  missionGroupId: string;
  rewardGroupId: string;
  period: Array<Period>
}

export interface PeriodicalRewards {
  groupId: string;
  id: string;
  sortIndex: number;
  rewards: Array<CostItem>;
}

export type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7;
