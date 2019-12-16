<template>
  <v-container>
    <warehouse-list :items="AllMaterials"/>
  </v-container>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import NumberInput from '@/components/NumberInput.vue';
  import WarehouseList from '@/components/WarehouseList.vue';
  import {mixins} from 'vue-class-component';
  import ItemSupport from '@/components/mixins/ItemSupport';

  @Component({
    components: {WarehouseList, NumberInput},
  })
  export default class Warehouse extends mixins(ItemSupport) {
  }
</script>
