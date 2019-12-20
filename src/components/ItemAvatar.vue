<template>
  <div @click.prevent.stop="openItemDialog">
    <v-row dense justify="center">
      <v-avatar :size="size">
        <img :src="itemIcon(item)" :alt="itemDetail(item).name"/>
      </v-avatar>
    </v-row>
    <v-row
      v-if="text"
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
  import {Mutations} from '@/store';

  @Component
  export default class ItemAvatar extends mixins(ItemSupport) {
    @Prop()
    public item!: string;
    @Prop()
    public text!: string;
    @Prop()
    public size!: number;

    private openItemDialog() {
      this.$store.commit(Mutations.OpenItemDialog, this.item);
    }
  }
</script>
