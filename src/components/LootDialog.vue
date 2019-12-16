<template>
  <v-dialog v-model="dialogShown">
    <v-card>
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

  @Component({
    components: {WarehouseList},
  })
  export default class LootDialog extends mixins(StageSupport) {
    @Prop()
    public stage!: string;
    @Model('input')
    public value!: boolean;

    private get dialogShown(): boolean {
      return this.value;
    }

    private set dialogShown(shown: boolean) {
      this.$emit('input', shown);
    }

    private get stageItems(): Array<string> {
      return this.getStageMaterialRewards(this.stage);
    }
  }
</script>

<style scoped lang="less">
</style>
