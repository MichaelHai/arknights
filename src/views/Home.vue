<template>
  <v-container>
    <v-row justify="center">
      <h2>Welcome to</h2>
    </v-row>
    <v-row justify="center">
      <img
        alt="logo"
        src="@/assets/logo.png"
        height="300"
      >
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class Home extends Vue {
  }
</script>
