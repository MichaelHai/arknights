<template>
  <v-row dense justify="center">
    <v-col cols="2" class="my-auto">
      <item-avatar
        :item="item"
        :text="count ? `× ${count}` : undefined"
      />
    </v-col>
    <v-col cols="1" class="ma-auto">
      <span>=</span>
    </v-col>
    <v-col
      v-for="compositeItem in getCompositeItems(item)"
      :key="`composite_${item}_${compositeItem.id}`"
      cols="2"
    >
      <item-avatar
        :class="compositeClass(compositeItem, count)"
        :item="compositeItem.id"
        :text="`${compositeItem.count} / ${ warehouseAmount(compositeItem.id) }`"
      />
    </v-col>
    <v-spacer/>
    <v-col cols="3" class="text-end my-auto">
      <v-btn small tile class="ma-1" @click="compositeOne">合成</v-btn>
      <v-btn v-if="count > 1" small tile class="ma-1" @click="compositeAll">全部</v-btn>
    </v-col>

    <v-dialog
      v-model="compositeBonusDialog"
      scrollable
    >
      <v-card>
        <v-card-title>副产品</v-card-title>
        <v-card-text>
          <warehouse-list :items="compositeBonusItems"/>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarMessage }}</v-snackbar>
    <v-snackbar v-model="compositeSnackbar" :timeout="3000">
      材料已合成!
      <v-btn @click.prevent="compositeBonusDialog = true" small text color="success">额外掉落</v-btn>
    </v-snackbar>
  </v-row>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Watch} from 'vue-property-decorator';
  import {mixins} from 'vue-class-component';
  import ItemSupport from '@/components/mixins/ItemSupport';
  import {CostItem} from '@/model';
  import WarehouseSupport from '@/components/mixins/WarehouseSupport';
  import ItemAvatar from '@/components/ItemAvatar.vue';
  import {Mutations} from '@/store';
  import WarehouseList from '@/components/WarehouseList.vue';

  @Component({
    components: {WarehouseList, ItemAvatar},
  })
  export default class CompositeFormula extends mixins(ItemSupport, WarehouseSupport) {
    @Prop()
    public item!: string;
    @Prop({
      required: false,
    })
    public count: number | undefined;

    private compositeSnackbar: boolean = false;
    private compositeBonusDialog: boolean = false;
    private compositeBonusItems: Array<string> = [];
    private snackbar: boolean = false;
    private snackbarMessage: string = '';

    private compositeClass(compositeItem: CostItem, itemCount: number): { [className: string]: boolean } {
      const warehouseAmount = this.warehouseAmount(compositeItem.id);
      return {
        'red--text': compositeItem.count > warehouseAmount,
        'green--text': compositeItem.count * itemCount <= warehouseAmount,
      };
    }

    private compositeOne() {
      this.composite(this.item, 1);
    }

    private compositeAll() {
      if (this.count && this.count > 0) {
        this.composite(this.item, this.count);
      }
    }

    private composite(item: string, count: number) {
      const costItem = {
        id: item,
        count,
      };
      const canComposite = this.checkComposite(costItem);

      if (!canComposite) {
        this.snackbar = true;
        return;
      }
      this.$store.commit(Mutations.ChangeItem, {item: costItem.id, amount: costItem.count});
      this.getCompositeItems(costItem.id).forEach((toComposite) => {
        this.$store.commit(Mutations.ChangeItem, {item: toComposite.id, amount: -costItem.count * toComposite.count});
      });

      this.compositeSnackbar = true;
      this.compositeBonusItems = this.AllMaterials.filter((material) => this.itemDetail(material).rarity === this.itemDetail(costItem.id).rarity - 1);
    }

    private checkComposite(item: CostItem): boolean {
      if (this.getCompositeItems(item.id)) {
        const compositeItems: Array<CostItem> = this.getCompositeItems(item.id);
        const isItemEnough = compositeItems.filter((toComposite) => {
          return (this.warehouseAmount(toComposite.id)) < (toComposite.count * item.count);
        }).length === 0;
        if (!isItemEnough) {
          this.snackbarMessage = '材料不足';
        }
        return isItemEnough;
      } else {
        this.snackbarMessage = '无法合成';
        return false;
      }
    }
  }
</script>

<style scoped lang="less">

</style>
