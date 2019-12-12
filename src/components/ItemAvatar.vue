<template>
  <div>
    <v-row dense justify="center">
      <v-avatar>
        <img :src="require(`@/assets/items/${item}.png`)" :alt="item"/>
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

  @Component
  export default class ItemAvatar extends Vue {
    @Prop()
    public item!: string;
    @Prop()
    public text!: string;
  }
</script>
