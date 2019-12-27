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
      <v-subheader>
        干员页面点击
        <v-icon color="grey lighten-1"> mdi-home</v-icon>
        将干员添加到首页.
      </v-subheader>
      <v-subheader>
        感谢素材和数据来源：
      </v-subheader>
      <v-subheader>
        <ul>
          <li>
            <a href="https://bbs.nga.cn/read.php?tid=19069337" target="_blank">NGA@根派</a>
          </li>
          <li>
            <a href="https://github.com/Perfare/ArknightsGameData" target="_blank">Perfare/ArknightsGameData</a>
          </li>
          <li>
            <a href="http://ak.mooncell.wiki/w/%E9%A6%96%E9%A1%B5" target="_blank">PRTS Wiki</a>
          </li>
        </ul>
      </v-subheader>
      <v-subheader>
        源代码: <a href="https://github.com/MichaelHai/arknights" target="_blank">MichaelHai/arknights</a>. 欢迎PR.
      </v-subheader>
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
