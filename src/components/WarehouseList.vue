<template>
  <v-row dense>
    <v-col v-for="item in items" :key="item.itemId" cols="6">
      <v-row dense>
        <v-col cols="4">
          <v-avatar>
            <img :alt="item.name" :src="require(`@/assets/items/${item.iconId}.png`)"/>
          </v-avatar>
        </v-col>
        <v-col>
          <number-input
            :value="itemCounts[item.itemId]"
            @input="(value) => itemCountChanged(item.itemId, value)"
            :label="item.name"
            @valueIncreased="increaseItem(item.itemId)"
            @valueDecreased="decreaseItem(item.itemId)"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {Mutations} from '@/store';
  import NumberInput from '@/components/NumberInput.vue';
  import {ItemDetail} from '@/model';

  @Component({
    components: {NumberInput},
  })
  export default class WarehouseList extends Vue {
    @Prop()
    public items!: Array<ItemDetail>;

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
