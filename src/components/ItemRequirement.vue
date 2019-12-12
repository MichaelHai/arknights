<template>
  <v-row dense :class="{'itemAmountEnough': (warehouseItemCounts[item.item] || 0) >= item.amount}">
    <v-col cols="5">
      <v-avatar size="40">
        <img
          :src="require(`@/assets/items/${item.item}.png`)" :alt="item.item"
        />
      </v-avatar>
    </v-col>
    <v-col cols="7" class="itemCount ma-auto">
      <v-row dense class="itemName">{{ item.item }}</v-row>
      <v-row dense>{{ warehouseItemCounts[item.item] || 0 }}/{{item.amount}}</v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {Item, ItemAmount} from '../model';

  @Component
  export default class ItemRequirement extends Vue {
    @Prop()
    public item!: ItemAmount;

    private get warehouseItemCounts(): { [item in Item]: number } {
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

  .itemAmountEnough {
    color: limegreen;
  }
</style>
