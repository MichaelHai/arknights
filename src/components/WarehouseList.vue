<template>
  <v-row dense>
    <v-col v-for="item in items" :key="item" cols="6">
      <v-row dense>
        <v-col cols="4">
          <item-avatar :item="item"/>
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
  import WarehouseSupport from '@/components/mixins/WarehouseSupport';
  import ItemAvatar from '@/components/ItemAvatar.vue';

  @Component({
    components: {ItemAvatar, NumberInput},
  })
  export default class WarehouseList extends mixins(ItemSupport, WarehouseSupport) {
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
  }
</script>

<style scoped lang="less">
</style>
