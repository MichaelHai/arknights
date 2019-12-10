<template>
  <v-container>
    <v-row dense>
      <v-col v-for="item in AllItems" :key="item" cols="6">
        <v-row dense>
          <v-col cols="4">
            <v-img :alt="item" :src="require(`@/assets/items/${item}.png`)"/>
          </v-col>
          <v-col>
            <number-input
              :value="itemCounts[item]"
              @input="(value) => itemCountChanged(item, value)"
              :label="item"
              @valueIncreased="increaseItem(item)"
              @valueDecreased="decreaseItem(item)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Mutations} from '@/store';
  import {AllItems, Item} from '@/model';
  import NumberInput from '@/components/NumberInput.vue';
  @Component({
    components: {NumberInput},
  })
  export default class Warehouse extends Vue {
    protected get AllItems(): Array<Item> {
      return AllItems;
    }

    protected get itemCounts(): { [item in Item]: number } {
      return this.$store.state.itemCounts;
    }

    protected increaseItem(item: Item): void {
      this.changeItem(item, 1);
    }

    protected itemCountChanged(item: Item, amount: number): void {
      this.$nextTick(() => {
        this.$store.commit(Mutations.SetItemCount, {item, amount});
      });
    }

    protected decreaseItem(item: Item): void {
      this.changeItem(item, -1);
    }

    private changeItem(item: Item, amount: number) {
      return this.$store.commit(Mutations.ChangeItem, {
        item,
        amount,
      });
    }
  }
</script>

<style scoped lang="less">
  /deep/ .v-label--active {
    margin-left: -24px;
  }
</style>
