<template>
  <div>
    <v-list>
      <v-list-item v-for="item in AllMaterials" :key="item">
        <v-list-item-action>
          <v-switch dense v-model="itemConfigs[item]"/>
        </v-list-item-action>
        <v-list-item-avatar>
          <item-avatar :item="item"></item-avatar>
        </v-list-item-avatar>
        <v-list-item-title>
          {{ itemDetail(item).name }}
        </v-list-item-title>
        <v-list-item-action>
          <template v-if="!itemConfigs[item]">
            <v-select
              dense
              v-model="itemStages[item]"
              :items="stagesForItem(item)"
              chips
              multiple
            />
          </template>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import ItemAvatar from '@/components/ItemAvatar.vue';
  import {mixins} from 'vue-class-component';
  import ItemSupport, {ItemSuggestion} from '@/components/mixins/ItemSupport';
  import StageSupport from '@/components/mixins/StageSupport';
  import MasterData from '@/assets/master-data.json';

  @Component({
    components: {ItemAvatar},
  })
  export default class MasterConfig extends mixins(ItemSupport, StageSupport) {
    private itemConfigs: { [id: string]: boolean } = {};
    private itemStages: { [id: string]: Array<string> } = {};

    protected created() {
      this.AllMaterials.forEach((item) => {
        // @ts-ignore
        const itemSuggestion: ItemSuggestion = MasterData['item-suggestions'][item];
        this.$set(this.itemConfigs, item, itemSuggestion === 'composite');
        this.$set(this.itemStages, item, itemSuggestion === 'composite' ? [] : itemSuggestion);
      });

      // @ts-ignore
      window.exportMasterData = () => {
        const suggestion: {[item: string]: ItemSuggestion} = {};
        this.AllMaterials.forEach((item) => {
          if (this.itemConfigs[item]) {
            suggestion[item] = 'composite';
          } else {
            suggestion[item] = this.itemStages[item];
          }
        });
        console.error(JSON.stringify(suggestion));
      };
    }

    private stagesForItem(item: string): Array<{ text: string; value: string }> {
      if (item === '32001') {
        return [{
          text: 'AP-5',
          value: 'wk_toxic_5',
        }];
      }
      return this.stageDrops(item)
        .map((stageId) => {
          return {
            text: this.getStageDetail(stageId).code,
            value: stageId,
          };
        });
    }
  }
</script>

<style scoped lang="less">

</style>
