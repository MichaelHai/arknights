<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="10000"
    bottom
    left
    class="snack"
  >
    New version available!
    <v-spacer/>
    <v-btn
      dark
      text
      color="#00f500"
      @click.native="refreshApp"
    >
      Refresh
    </v-btn>
    <v-btn
      icon
      @click="snackWithButtons = false"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class UpdateNotification extends Vue {
    private snackbar: boolean = false;
    private refreshing: boolean = false;
    private registration: ServiceWorkerRegistration | null = null;

    private created() {
      // Listen for swUpdated event and display refresh snackbar as required.
      document.addEventListener('swUpdated', this.showRefreshUI as EventListener, {once: true});
      // Refresh all open app tabs when a new service worker is installed.
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!this.refreshing) {
          this.refreshing = true;
          window.location.reload();
        }
      });
    }

    private showRefreshUI(e: CustomEvent<ServiceWorkerRegistration>) {
      // Display a snackbar inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.
      // Store the ServiceWorkerRegistration instance for later use.
      this.registration = e.detail;
      this.snackbar = true;
    }

    private refreshApp() {
      this.snackbar = false;
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage({type: 'SKIP_WAITING'});
    }
  }
</script>

<style scoped lang="less">

</style>
