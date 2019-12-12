<template>
  <v-dialog v-model="dialogShown">
    <v-card>
      <v-card-title>{{ map }}</v-card-title>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Model, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class LootDialog extends Vue {
    @Prop()
    public map!: string;
    @Model('input')
    public value!: boolean;

    private get dialogShown(): boolean {
      return this.value;
    }

    private set dialogShown(shown: boolean) {
      this.$emit('input', shown);
    }
  }
</script>

<style scoped lang="less">

</style>
