<template>
  <v-container>
    <warehouse-list :items="AllMaterials"/>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {AllMaterials, ItemDetail} from '@/model';
  import NumberInput from '@/components/NumberInput.vue';
  import WarehouseList from '@/components/WarehouseList.vue';

  @Component({
    components: {WarehouseList, NumberInput},
  })
  export default class Warehouse extends Vue {
    protected get AllMaterials(): Array<ItemDetail> {
      return AllMaterials;
    }
  }
</script>
