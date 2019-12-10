<template>
  <div>
    <agent-detail-card v-if="homeAgent" :agent="homeAgent"/>
    <v-container v-else>
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
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import AgentDetailCard from '@/components/AgentDetailCard.vue';
  import {Agent} from '@/model';

  @Component({
    components: {AgentDetailCard},
  })
  export default class Home extends Vue {
    protected get homeAgent(): Agent | null {
      return this.$store.state.homeAgent;
    }
  }
</script>
