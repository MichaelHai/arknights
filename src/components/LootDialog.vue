<template>
  <v-dialog v-model="shown">
    <v-card v-if="stage">
      <v-card-title>{{ getStageDetail(stage).code }}</v-card-title>
      <v-card-text class="px-2">
        <warehouse-list :items="stageItems"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Model, Prop} from 'vue-property-decorator';
  import WarehouseList from '@/components/WarehouseList.vue';
  import {mixins} from 'vue-class-component';
  import StageSupport from '@/components/mixins/StageSupport';
  import {Mutations} from '@/store';

  @Component({
    components: {WarehouseList},
  })
  export default class LootDialog extends mixins(StageSupport) {
    public get stage(): string | null {
      return this.$store.state.uiControl.lootDialog.stage;
    }

    public get shown(): boolean {
      return this.$store.state.uiControl.lootDialog.shown;
    }

    public set shown(shown: boolean) {
      this.$store.commit(Mutations.CloseLootDialog);
    }

    private get stageItems(): Array<string> {
      if (this.stage) {
        return this.getStageMaterialRewards(this.stage);
      } else {
        return [];
      }
    }
  }
</script>

<style scoped lang="less">
</style>
