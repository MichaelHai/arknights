<template>
  <div>
    <character-detail-card v-if="homeCharacterId" :characterId="homeCharacterId"/>
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
  import CharacterDetailCard from '@/components/CharacterDetailCard.vue';

  @Component({
    components: {CharacterDetailCard},
  })
  export default class Home extends Vue {
    protected get homeCharacterId(): string | null {
      return this.$store.state.homeCharacterId;
    }
  }
</script>
