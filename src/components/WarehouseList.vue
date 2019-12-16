<template>
  <v-row dense>
    <v-col v-for="item in items" :key="item" cols="6">
      <v-row dense>
        <v-col cols="4">
          <v-avatar>
            <img :alt="itemDetail(item).name" :src="itemIcon(item)"/>
          </v-avatar>
        </v-col>
        <v-col>
          <number-input
            :value="itemCounts[item]"
            @input="(value) => itemCountChanged(item, value)"
            :label="itemDetail(item).name"
            @valueIncreased="increaseItem(item)"
            @valueDecreased="decreaseItem(item)"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {Component, Prop} from 'vue-property-decorator';
  import {Mutations} from '@/store';
  import NumberInput from '@/components/NumberInput.vue';
  import {mixins} from 'vue-class-component';
  import ItemSupport from '@/components/mixins/ItemSupport';

  @Component({
    components: {NumberInput},
  })
  export default class WarehouseList extends mixins(ItemSupport) {
    @Prop()
    public items!: Array<string>;

    protected get itemCounts(): { [item in string]: number } {
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
</style>
