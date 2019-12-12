<template>
  <v-container>
    <warehouse-list :items="AllItems"/>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {AllItems, Item} from '@/model';
  import NumberInput from '@/components/NumberInput.vue';
  import WarehouseList from '@/components/WarehouseList.vue';

  @Component({
    components: {WarehouseList, NumberInput},
  })
  export default class Warehouse extends Vue {
    protected get AllItems(): Array<Item> {
      return AllItems;
    }
  }
</script>
