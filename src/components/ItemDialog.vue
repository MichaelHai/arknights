<template>
  <v-dialog v-model="shown">
    <v-card v-if="item">
      <v-card-title>
        <item-avatar :item="item"/>
        <div class="my-auto ml-2">
          {{ itemDetail(item).name }}
        </div>
        <v-chip class="my-auto ml-2">
          <v-icon left>mdi-warehouse</v-icon>
          {{ warehouseAmount(item) }}
        </v-chip>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-card elevation="0">
          <v-card-subtitle>
            <v-row class="ml-0">
              <div class="my-auto mr-2">
                推荐获取方式:
              </div>
              <div v-if="getItemSuggestion(item) === 'composite'">
                合成
              </div>
              <div v-else>
                <v-btn
                  v-for="stage in getItemSuggestion(item)"
                  :key="`btn_${stage}`"
                  @click.stop="mapClicked(stage)"
                  small
                  tile
                  class="ma-1"
                >
                  {{ getStageDetail(stage).code }}
                </v-btn>
              </div>
              <v-spacer/>
            </v-row>
          </v-card-subtitle>
          <template v-if="getCompositeItems(item).length > 0">
            <v-divider/>
            <v-card-subtitle>合成公式</v-card-subtitle>
            <v-card-text>
              <composite-formula :item="item"/>
            </v-card-text>
          </template>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import {Mutations} from '@/store';
  import {mixins} from 'vue-class-component';
  import ItemSupport from '@/components/mixins/ItemSupport';
  import ItemAvatar from '@/components/ItemAvatar.vue';
  import WarehouseSupport from '@/components/mixins/WarehouseSupport';
  import StageSupport from '@/components/mixins/StageSupport';
  import CompositeFormula from '@/components/CompositeFormula.vue';

  @Component({
    components: {CompositeFormula, ItemAvatar},
  })
  export default class ItemDialog extends mixins(ItemSupport, WarehouseSupport, StageSupport) {
    private get shown(): boolean {
      return this.$store.state.uiControl.itemDialog.shown;
    }

    private set shown(shown: boolean) {
      this.$store.commit(Mutations.CloseItemDialog);
    }

    private get item(): string {
      return this.$store.state.uiControl.itemDialog.item;
    }

    private mapClicked(stage: string) {
      this.$store.commit(Mutations.OpenLootDialog, stage);
    }
  }
</script>

<style scoped lang="less">

</style>
