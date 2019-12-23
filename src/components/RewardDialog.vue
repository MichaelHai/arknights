<template>
  <v-dialog scrollable v-model="shown">
    <v-card>
      <v-card-title>日常</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="rewardInfo in rewards" :key="rewardInfo.rewardKey">
            <v-list-item-content>
              <v-row>
                <v-col cols="6" v-for="item in rewardInfo.rewards" :key="item.id">
                  <item-avatar :item="item.id" :text="`× ${item.count}`"/>
                </v-col>
              </v-row>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                small
                @click="rewardsGained(rewardInfo.rewards, rewardInfo.rewardKey)"
                :disabled="rewardInfo.finished"
              >
                {{ rewardInfo.finished ? '已' : '' }}{{rewardInfo.buttonText}}
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Emit, Model, Prop} from 'vue-property-decorator';
  import {CostItem} from '@/model';
  import {mixins} from 'vue-class-component';
  import WarehouseSupport from '@/components/mixins/WarehouseSupport';
  import ItemAvatar from '@/components/ItemAvatar.vue';

  export interface RewardInfo {
    rewards: Array<CostItem>;
    finished: boolean;
    buttonText: string;
    rewardKey: string | number;
  }

  @Component({
    components: {ItemAvatar},
  })
  export default class RewardDialog extends mixins(WarehouseSupport) {
    @Model('input')
    public value: boolean = false;

    @Prop()
    public rewards!: Array<RewardInfo>;

    public get shown(): boolean {
      return this.value;
    }

    public set shown(shown: boolean) {
      this.$emit('input', shown);
    }

    @Emit('rewardsGained')
    private rewardsGained(items: Array<CostItem>, key: string | number) {
      items.forEach((item) => this.changeItem(item.id, item.count));
      return key;
    }
  }
</script>

<style scoped lang="less">

</style>
