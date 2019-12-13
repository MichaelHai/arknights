<template>
  <v-row dense :class="{'green--text': (warehouseItemCounts[item.id] || 0) >= item.count}">
    <v-col cols="5">
      <v-avatar size="40">
        <img
          :src="itemIcon(item.id)"
          :alt="itemDetail(item.id).name"
        />
      </v-avatar>
    </v-col>
    <v-col cols="7" class="itemCount ma-auto">
      <v-row dense class="itemName">{{ itemDetail(item.id).name }}</v-row>
      <v-row dense>{{ warehouseItemCounts[item.id] || 0 }}/{{item.count}}</v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {Component, Prop} from 'vue-property-decorator';
  import {CostItem} from '@/model';
  import ItemSupport from '@/model/ItemSupport';
  import {mixins} from 'vue-class-component';

  @Component
  export default class ItemRequirement extends mixins(ItemSupport) {
    @Prop()
    public item!: CostItem;

    private get warehouseItemCounts(): { [item: string]: number } {
      return this.$store.state.itemCounts;
    }
  }
</script>

<style lang="less">
  .itemCount {
    font-size: 12px;
    line-height: 16px;
  }

  .itemName {
    overflow: hidden;
    white-space: nowrap;
  }
</style>
