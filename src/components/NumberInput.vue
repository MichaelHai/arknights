<template>
  <v-text-field
    :value="value"
    @input="(value) => $emit('input', Number(value))"
    type="number"
    :label="label"
    append-icon="mdi-plus"
    @click:append="$emit('valueIncreased')"
    prepend-inner-icon="mdi-minus"
    @click:prepend-inner="$emit('valueDecreased')"
    dense
  >
  </v-text-field>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class NumberInput extends Vue {
    @Prop()
    public value!: number;
    @Prop()
    public label!: string;
  }
</script>

<style scoped lang="less">
  /deep/ .v-label--active {
    margin-left: -24px;
    overflow: visible !important;
  }
</style>
