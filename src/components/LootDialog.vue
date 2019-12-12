<template>
  <v-dialog v-model="dialogShown">
    <v-card>
      <v-card-title>{{ map }}</v-card-title>
      <v-card-text class="px-2">
        <warehouse-list :items="mapItems"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Model, Prop, Vue} from 'vue-property-decorator';
  import WarehouseList from '@/components/WarehouseList.vue';
  import MasterData from '@/assets/master-data.json';
  import {BattleMap, Item} from '@/model';

  @Component({
    components: {WarehouseList},
  })
  export default class LootDialog extends Vue {
    @Prop()
    public map!: BattleMap;
    @Model('input')
    public value!: boolean;

    private get dialogShown(): boolean {
      return this.value;
    }

    private set dialogShown(shown: boolean) {
      this.$emit('input', shown);
    }

    private get mapItems(): Array<Item> {
      const maps: { [map in BattleMap]: Array<Item> } = MasterData.maps;
      return maps[this.map];
    }
  }
</script>

<style scoped lang="less">
</style>
