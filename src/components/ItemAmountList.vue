<template>
  <v-row dense>
    <v-col cols="2" class="lineTitle">{{ title }}</v-col>
    <v-col cols="10">
      <v-row dense>
        <template v-for="item in items">
          <v-col cols="4" v-if="item.item !== '龙门币'" :key="item.item">
            <v-row dense>
              <v-col cols="5">
                <v-img
                  :src="require(`@/assets/items/${item.item}.png`)"
                />
              </v-col>
              <v-col cols="7" class="itemCount">
                <v-row dense class="itemName">{{ item.item }}</v-row>
                <v-row dense>{{ warehouseItemCounts[item.item] || 0 }}/{{item.amount}}</v-row>
              </v-col>
            </v-row>
          </v-col>
        </template>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {Item, ItemAmount} from '@/model';

  @Component
  export default class ItemAmountList extends Vue {
    @Prop()
    public items!: Array<ItemAmount>;
    @Prop()
    public title!: string;

    private get warehouseItemCounts(): { [item in Item]: number } {
      return this.$store.state.itemCounts;
    }
  }
</script>

<style scoped lang="less">
  .itemCount {
    font-size: 12px;
    line-height: 16px;
  }

  .lineTitle {
    margin: auto 0;
    font-size: 12px;
  }

  .itemName {
    overflow: hidden;
    white-space: nowrap;
  }
</style>
