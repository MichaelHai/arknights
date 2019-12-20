<template>
  <v-app id="home">
    <v-app-bar app>
      <v-img
        alt="logo"
        class="shrink mr-2"
        contain
        src="@/assets/logo.png"
        width="40"
      />
      <v-toolbar-title title>企鹅物流</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>

    <v-bottom-navigation app fixed>
      <v-btn to="/">
        <span>首页</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn to="/planner">
        <span>干员</span>
        <v-icon>mdi-clipboard-list</v-icon>
      </v-btn>
      <v-btn to="/warehouse">
        <span>库存</span>
        <v-icon>mdi-warehouse</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <item-dialog/>
    <loot-dialog/>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ItemDialog from '@/components/ItemDialog.vue';
  import LootDialog from '@/components/LootDialog.vue';
  @Component({
    components: {LootDialog, ItemDialog},
  })
  export default class App extends Vue {
  }
</script>

<style lang="less">
  #home {
    margin-bottom: env(safe-area-inset-bottom) !important;
  }
</style>
