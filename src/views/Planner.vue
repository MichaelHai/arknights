<template>
  <div>
    <v-list dense>
      <v-list-item
        v-for="characterId in characters"
        :key="characterId"
        @click="characterClicked(characterId)"
      >
        <v-list-item-avatar class="avatar" tile>
          <v-img :src="characterAvatar(characterId)">
            <v-icon class="avatarCheck" color="success" v-if="targetAchieved(characterId)">mdi-check-circle</v-icon>
          </v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-row dense>
            <v-col cols="3">
              <v-list-item-title v-text="characterDetail(characterId).name"></v-list-item-title>
              <v-list-item-subtitle v-text="characterDetail(characterId).appellation"/>
              <v-list-item-subtitle>
                {{ characterDetail(characterId).rarity + 1 }}星
                <v-img
                  :src="phaseIcon(characterData(characterId).phase)"
                  contain
                  height="13"
                  width="20"
                  class="phaseIcon"
                />
              </v-list-item-subtitle>
            </v-col>
            <v-col v-if="characterData(characterId).allSkillLevel < 6" class="skillLevel">
              技能等级: {{ characterData(characterId).allSkillLevel + 1 }}
            </v-col>
            <v-col v-else cols="3" v-for="(skillLevel, skillId) in characterData(characterId).skillLevel"
                   :key="`${characterId}_skill_${skillId}`">
              <v-img
                :src="skillIcon(skillId)"
                contain
                height="32"
              />
              <div class="rank">
                Rank {{ skillLevel }}
              </div>
            </v-col>
          </v-row>
        </v-list-item-content>

        <v-list-item-action @click.prevent.stop="homeClicked(characterId)">
          <v-icon
            v-if="characterId === homeCharacterId"
            color="yellow"
          >
            mdi-home
          </v-icon>
          <v-icon
            v-else
            color="grey lighten-1"
          >
            mdi-home
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-bottom-sheet v-model="isBottomSheetShow" :scrollable="true">
      <character-detail-card :characterId="characterShownInBottomSheet"/>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import {CharacterDetail, Characters, Profession} from '@/model';
  import {CharacterData, Getters, Mutations} from '@/store';
  import CharacterDetailCard from '@/components/CharacterDetailCard.vue';
  import {mixins} from 'vue-class-component';
  import ImageHelper from '@/components/mixins/ImageHelper';
  import {targetAchieved} from '@/model/Utils';

  @Component({
    components: {CharacterDetailCard},
  })
  export default class Planner extends mixins(ImageHelper) {
    private isBottomSheetShow: boolean = false;
    private characterShownInBottomSheet: string | null = null;

    private characterData(characterId: string): CharacterData {
      return this.$store.getters[Getters.CharacterData](characterId);
    }

    protected targetAchieved(characterId: string): boolean {
      return targetAchieved(this.characterData(characterId));
    }

    protected get characters(): Array<string> {
      return Object.keys(Characters)
        .filter((c) => Characters[c].profession !== Profession.TOKEN)
        .filter((c) => Characters[c].profession !== Profession.TRAP)
        .sort((c1, c2) => Characters[c2].rarity - Characters[c1].rarity);
    }

    protected homeClicked(characterId: string): void {
      if (characterId === this.homeCharacterId) {
        this.homeCharacterId = null;
      } else {
        this.homeCharacterId = characterId;
      }
    }

    private set homeCharacterId(characterId: string | null) {
      this.$store.commit(Mutations.SetHomeCharacter, characterId);
    }

    private get homeCharacterId(): string | null {
      return this.$store.state.homeCharacterId;
    }

    protected characterClicked(character: string): void {
      this.isBottomSheetShow = true;
      this.characterShownInBottomSheet = character;
    }

    private characterDetail(characterId: string): CharacterDetail {
      return Characters[characterId];
    }
  }
</script>

<style scoped lang="less">
  .avatar {
    margin-right: 8px !important;
  }

  .rank {
    text-align: center;
    font-size: 13px;
    margin-top: 4px;
  }

  .phaseIcon {
    display: inline-block;
    vertical-align: middle;
  }

  .avatarCheck {
    font-size: 16px;
    margin-top: 12px;
    margin-left: 20px;
  }
</style>
