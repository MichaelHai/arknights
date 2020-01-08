<template>
  <v-row dense :class="{'green--text': warehouseAmount(item.id) >= item.count}">
    <v-col cols="5">
      <item-avatar :item="item.id" :size="40"/>
    </v-col>
    <v-col cols="7" class="itemCount ma-auto">
      <v-row dense class="itemName">{{ itemDetail(item.id).name }}</v-row>
      <v-row dense>{{item.count}}/{{ warehouseAmount(item.id) }}</v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {Component, Prop} from 'vue-property-decorator';
  import {CostItem} from '@/model';
  import ItemSupport from '@/components/mixins/ItemSupport';
  import {mixins} from 'vue-class-component';
  import WarehouseSupport from '@/components/mixins/WarehouseSupport';
  import ItemAvatar from '@/components/ItemAvatar.vue';
  @Component({
    components: {ItemAvatar},
  })
  export default class ItemRequirement extends mixins(ItemSupport, WarehouseSupport) {
    @Prop()
    public item!: CostItem;
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
