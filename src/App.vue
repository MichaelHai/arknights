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
      <v-spacer/>
      <v-menu>
        <template #activator="{on}">
          <v-btn text v-on="on">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="startImport">
            <v-list-item-icon class="mr-1">
              <v-icon small>mdi-import</v-icon>
            </v-list-item-icon>
            <v-list-item-title>导入</v-list-item-title>
          </v-list-item>
          <v-list-item @click="startExport">
            <v-list-item-icon class="mr-1">
              <v-icon small>mdi-export</v-icon>
            </v-list-item-icon>
            <v-list-item-title>导出</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
    <composite-bonus/>
    <update-notification/>
    <v-dialog v-model="importExportDialog">
      <v-card>
        <v-card-text>
          <v-textarea v-model="allUserData" :readonly="!isImport" rows="20"/>
        </v-card-text>
        <v-card-actions v-if="isImport">
          <v-spacer/>
          <v-btn @click="doImport">导入</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      bottom
      left
    >
      {{ message }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ItemDialog from '@/components/ItemDialog.vue';
  import LootDialog from '@/components/LootDialog.vue';
  import CompositeBonus from '@/components/CompositeBonus.vue';
  import UpdateNotification from '@/components/UpdateNotification.vue';
  import {Getters, Mutations} from '@/store';

  @Component({
    components: {UpdateNotification, CompositeBonus, LootDialog, ItemDialog},
  })
  export default class App extends Vue {
    private importExportDialog: boolean = false;
    private isImport: boolean = false;
    private allUserData: string = '';

    private snackbar: boolean = false;
    private message: string = '';

    private startImport() {
      this.importExportDialog = true;
      this.isImport = true;
      this.allUserData = '';
    }

    private startExport() {
      this.importExportDialog = true;
      this.isImport = false;
      this.allUserData = JSON.stringify(this.$store.getters[Getters.ExportData]());
    }

    private doImport() {
      try {
        const userState = JSON.parse(this.allUserData);
        this.$store.commit(Mutations.Import, userState);
        this.importExportDialog = false;
        this.message = '导入成功！';
        this.snackbar = true;
      } catch (error) {
        this.message = '数据错误，请检查！';
        this.snackbar = true;
      }
    }
  }
</script>

<style lang="less">
  #home {
    margin-bottom: env(safe-area-inset-bottom) !important;
  }
</style>
