<template>
  <div>
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
    <v-snackbar v-model="compositeSnackbar" :timeout="3000">
      材料已合成!
      <v-btn @click.prevent="compositeBonusDialog = true" small text color="success">额外掉落</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Mutations} from '@/store';
  import WarehouseList from '@/components/WarehouseList.vue';

  @Component({
    components: {WarehouseList},
  })
  export default class CompositeBonus extends Vue {
    private compositeBonusDialog: boolean = false;

    private get compositeSnackbar(): boolean {
      return this.$store.state.uiControl.compositeBonus.snackbar;
    }

    private get compositeBonusItems(): Array<string> {
      return this.$store.state.uiControl.compositeBonus.items;
    }

    private set compositeSnackbar(shown: boolean) {
      if (!shown) {
        this.$store.commit(Mutations.HideCompositeBonusSnackbar);
      }
    }
  }
</script>

<style scoped lang="less">

</style>
