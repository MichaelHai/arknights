<template>
  <v-card>
    <v-card-text>
      <warehouse-list :items="AllMaterials">
      </warehouse-list>
    </v-card-text>
    <v-speed-dial
      bottom right
      direction="top"
      transition="slide-y-reverse-transition"
      fixed
      class="speed-dial"
    >
      <template v-slot:activator>
        <v-btn
          fab
          color="red"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-btn
        fab
        small
        @click.prevent="creditShopDialog = true"
      >
        <v-icon>mdi-credit-card</v-icon>
      </v-btn>
      <v-btn
        fab
        small
        @click.prevent="openDailyMissionDialog"
      >
        <v-icon>mdi-calendar-today</v-icon>
      </v-btn>
    </v-speed-dial>

    <v-dialog
      v-model="creditShopDialog"
      scrollable
    >
      <v-card>
        <v-card-title>信用商店</v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item v-for="item in creditShopItems" :key="item" dense>
              <v-list-item-avatar>
                <item-avatar :item="item"></item-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ itemDetail(item).name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  库存: {{ warehouseAmount(item) }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  small
                  @click="changeItem(item, creditShopItemAmount[item])"
                >
                  + {{ creditShopItemAmount[item] }}
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <reward-dialog
      v-model="dailyDialog"
      :rewards="dailyRewardsAndCheckin"
      @rewardsGained="rewardsGained"
    />
  </v-card>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import NumberInput from '@/components/NumberInput.vue';
  import WarehouseList from '@/components/WarehouseList.vue';
  import {mixins} from 'vue-class-component';
  import ItemSupport from '@/components/mixins/ItemSupport';
  import ItemAvatar from '@/components/ItemAvatar.vue';
  import WarehouseSupport from '@/components/mixins/WarehouseSupport';
  import MissionSupport from '@/components/mixins/MissionSupport';
  import {CostItem} from '@/model';
  import {Getters, Mutations} from '@/store';
  import {currentDay} from '@/model/Utils';
  import {Moment} from 'moment-timezone/moment-timezone';
  import CheckinSupport from '@/components/mixins/CheckinSupport';
  import RewardDialog, {RewardInfo} from '@/components/RewardDialog.vue';

  @Component({
    components: {RewardDialog, ItemAvatar, WarehouseList, NumberInput},
  })
  export default class Warehouse extends mixins(ItemSupport, WarehouseSupport, MissionSupport, CheckinSupport) {
    private creditShopDialog: boolean = false;
    private creditShopItemAmount: { [item: string]: number } = {
      '3302': 3,
      '3301': 5,
      '30012': 3,
      '30022': 2,
      '30032': 2,
      '30042': 2,
      '30052': 2,
      '30062': 1,
      '30011': 2,
      '30021': 2,
      '30031': 2,
      '30041': 2,
      '30051': 2,
      '30061': 2,
    };

    private dailyDialog: boolean = false;
    private dailyDialogDay: Moment = currentDay();

    private get creditShopItems(): Array<string> {
      return Object.keys(this.creditShopItemAmount)
        .map((item) => this.itemDetail(item))
        .sort((item1, item2) => item1.sortId - item2.sortId)
        .map((item) => item.itemId);
    }

    private get dailyRewardsAndCheckin(): Array<RewardInfo> {
      const dailyRewardsInfo: Array<RewardInfo> = this.dailyRewards
        .map((dailyReward, index) => {
          return {
            rewards: dailyReward,
            finished: this.dailyMissionStats[index],
            buttonText: '完成',
            rewardKey: index,
          };
        });
      if (this.checkinItem) {
        dailyRewardsInfo.push({
          rewards: [this.checkinItem],
          finished: this.checkinStat,
          buttonText: '签到',
          rewardKey: 'checkin',
        });
      }
      return dailyRewardsInfo;
    }

    private rewardsGained(key: number | string) {
      if (key === 'checkin') {
        this.checkin();
      } else if (typeof key === 'number') {
        this.missionFinished(key);
      }
    }

    private missionFinished(index: number) {
      this.$store.commit(Mutations.DailyMissionFinished, {
        day: this.dailyDialogDay,
        index,
      });
    }

    private get dailyMissionStats() {
      return this.$store.getters[Getters.DailyMission](this.dailyDialogDay);
    }

    private get dailyRewards(): Array<Array<CostItem>> {
      return this.getDailyRewards(this.dailyDialogDay);
    }

    private openDailyMissionDialog() {
      this.dailyDialogDay = currentDay();
      this.dailyDialog = true;
    }

    private get checkinItem(): CostItem | null {
      const item = this.getCheckin(this.dailyDialogDay);
      if (item && this.AllMaterials.indexOf(item.id) >= 0) {
        return item;
      } else {
        return null;
      }
    }

    private get checkinStat(): boolean {
      return this.$store.getters[Getters.Checkin](this.dailyDialogDay);
    }

    private checkin() {
      this.$store.commit(Mutations.Checkin, this.dailyDialogDay);
    }
  }
</script>

<style lang="less">
  .speed-dial {
    margin-bottom: 56px;
  }
</style>
