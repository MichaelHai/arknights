<template>
  <v-container>
    <v-row dense>
      <v-col v-for="item in items" :key="item" cols="6">
        <v-row dense>
          <v-col cols="4">
            <v-img :alt="item" :src="require(`@/assets/items/${item}.png`)"/>
          </v-col>
          <v-col>
            <v-text-field
              :value="itemCounts[item]"
              @input="(value) => itemCountChanged(item, Number(value))"
              type="number"
              :label="item"
              append-icon="mdi-plus"
              @click:append="increaseItem(item)"
              prepend-inner-icon="mdi-minus"
              @click:prepend-inner="decreaseItem(item)"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import MasterData from '@/assets/master-data.json';
  import {Mutations} from '@/store';

  @Component
  export default class Warehouse extends Vue {
    protected items: Array<string> = MasterData.items.map((item) => item.name);

    protected get itemCounts(): { [item: string]: number } {
      return this.$store.state.itemCounts;
    }

    protected increaseItem(item: string): void {
      this.changeItem(item, 1);
    }

    protected itemCountChanged(item: string, amount: number): void {
      this.$nextTick(() => {
        this.$store.commit(Mutations.SetItemCount, {item, amount});
      });
    }

    protected decreaseItem(item: string): void {
      this.changeItem(item, -1);
    }

    private changeItem(item: string, amount: number) {
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
