<template>
  <v-app>
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

    <v-bottom-navigation app>
      <v-btn to="/">
        <span>首页</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn to="/planner">
        <span>规划</span>
        <v-icon>mdi-clipboard-list</v-icon>
      </v-btn>
      <v-btn to="/warehouse">
        <span>库存</span>
        <v-icon>mdi-warehouse</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class App extends Vue {
  }
</script>
