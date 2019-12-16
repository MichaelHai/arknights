<template>
  <div>
    <v-row dense justify="center">
      <v-avatar>
        <img :src="itemIcon(item)" :alt="itemDetail(item).name"/>
      </v-avatar>
    </v-row>
    <v-row
      dense
      justify="center"
    >
      {{ text }}
    </v-row>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {mixins} from 'vue-class-component';
  import ItemSupport from '@/components/mixins/ItemSupport';

  @Component
  export default class ItemAvatar extends mixins(ItemSupport) {
    @Prop()
    public item!: string;
    @Prop()
    public text!: string;
  }
</script>
