<template>
  <div>
    <v-row dense @click.stop="showDialog = true">
      <v-col cols="3" class="ma-auto">{{ title }}</v-col>
      <v-col cols="9">
        <v-row dense>
          <template v-for="item in items">
            <v-col cols="6" :key="item.item">
              <item-requirement :item="item"/>
            </v-col>
          </template>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" scrollable fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dense absolute width="100%">
          <v-btn icon @click="showDialog = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn text @click="doLevelUp">完成</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pa-0 pt-12">
          <v-card elevation="0">
            <v-card-subtitle>需求一览</v-card-subtitle>
            <v-card-text>
              <v-row dense>
                <v-col cols="4" v-for="item in items" :key="`dialog_${item.item}`">
                  <item-requirement :item="item"/>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider/>

            <v-card-subtitle>建议刷图</v-card-subtitle>

            <v-card-text>
              <v-list dense>
                <v-list-item dense class="pa-0">
                  <v-list-item-content>
                    <v-row dense>
                      <template v-for="item in mapItems">
                        <v-col cols="2" :key="`shortage_icon_${item.item}`">
                          <item-avatar
                            :item="item.item"
                            :text="`× ${item.amount}`"
                          />
                        </v-col>
                        <v-col cols="4" :key="`shortage_map_${item.item}`" class="ma-auto">
                          <v-row v-if="itemDetails[item.item] && itemDetails[item.item].suggest === 'map'" dense>
                            <v-btn
                              v-for="map in itemDetails[item.item].map"
                              :key="`btn_${map}`"
                              @click.stop="mapClicked(map)"
                              small
                              tile
                              class="ma-1"
                            >
                              {{ map }}
                            </v-btn>
                          </v-row>
                        </v-col>
                      </template>
                      <v-col cols="6" v-if="mapItems.length % 2 === 1"/>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-divider/>

            <v-card-subtitle>建议合成</v-card-subtitle>
            <v-card-text>
              <v-list dense>
                <v-list-item v-for="item in compositeItems" :key="`shortage_${item.item}`" dense class="pa-0">
                  <v-list-item-content>
                    <v-row dense justify="center">
                      <v-col cols="2">
                        <item-avatar
                          :item="item.item"
                          :text="`× ${item.amount}`"
                        />
                      </v-col>
                      <v-col cols="1" class="ma-auto">
                        <span>=</span>
                      </v-col>
                      <template v-if="itemDetails[item.item] && itemDetails[item.item].composite">
                        <v-col
                          v-for="compositeItem in itemDetails[item.item].composite"
                          :key="`composite_${item.item}_${compositeItem.item}`"
                          cols="2"
                        >
                          <item-avatar
                            :class="compositeClass(compositeItem, item.amount)"
                            :item="compositeItem.item"
                            :text="`${compositeItem.amount} / ${ getItemAmountInWarehouse(compositeItem.item) }`"
                          />
                        </v-col>
                      </template>
                      <v-spacer/>
                      <v-col cols="3" class="text-end">
                        <v-btn small tile class="ma-1" @click="compositeOne(item.item)">合成</v-btn>
                        <v-btn small tile class="ma-1" @click="composite(item)"> 全部</v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

    <loot-dialog
      :map="lootDialogMap"
      v-model="lootDialog"
    />

    <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarMessage }}</v-snackbar>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {Agent, AgentDetail, BattleMap, Item, ItemAmount, ItemDetail, LevelUp, LevelUpType} from '@/model';
  import ItemRequirement from '@/components/ItemRequirement.vue';
  import LootDialog from '@/components/LootDialog.vue';
  import MasterData from '@/assets/master-data.json';
  import ItemAvatar from '@/components/ItemAvatar.vue';
  import {AgentData, Getters, Mutations} from '@/store';
  import any = jasmine.any;

  @Component({
    components: {ItemAvatar, LootDialog, ItemRequirement},
  })
  export default class ItemAmountList extends Vue {
    @Prop()
    public items!: Array<ItemAmount>;
    @Prop()
    public title!: string;
    @Prop()
    public levelUp!: LevelUp;

    private showDialog: boolean = false;
    private mapItems: Array<ItemAmount> = [];
    private compositeItems: Array<ItemAmount> = [];
    private snackbar: boolean = false;
    private snackbarMessage: string = '';
    private lootDialog: boolean = false;
    private lootDialogMap: BattleMap = '';
    private itemDetails: { [item in Item]: ItemDetail } = MasterData.items;
    private agentDetails: { [agent in Agent]: AgentDetail } = MasterData.agents;

    private get warehouseItemCounts(): { [item in Item]: number } {
      return this.$store.state.itemCounts;
    }

    @Watch('showDialog')
    private showDialogChanged() {
      if (this.showDialog) {
        this.calculateSuggestion();
      } else {
        this.mapItems = [];
        this.compositeItems = [];
      }
    }

    private calculateSuggestion() {
      this.mapItems = [];
      this.compositeItems = [];
      const unprocessedItems: Array<ItemAmount> = [...this.items];
      const mapItemsMap = new Map<Item, number>();
      const compositeItemsMap = new Map<Item, number>();
      while (unprocessedItems.length !== 0) {
        const item = unprocessedItems.pop()!;
        const itemName = item.item;
        if (this.itemDetails[itemName].suggest === 'map') {
          this.addToMap(item, mapItemsMap);
        } else {
          const countAdded = this.addToMap(item, compositeItemsMap);
          const compositeItems: Array<ItemAmount> = this.itemDetails[itemName].composite!;
          for (let i = 0; i < countAdded; i++) {
            unprocessedItems.push(...compositeItems);
          }
        }
      }

      this.addToList(mapItemsMap, this.mapItems);
      this.addToList(compositeItemsMap, this.compositeItems);
    }

    private addToList(map: Map<Item, number>, list: Array<ItemAmount>) {
      map.forEach((amount, item) => {
        if (amount > 0) {
          list.push({
            item,
            amount,
          });
        }
      });
    }

    private addToMap(item: ItemAmount, mapItemsMap: Map<Item, number>): number {
      const itemName = item.item;
      let count = item.amount;
      let countAdded = 0;
      if (!mapItemsMap.has(itemName)) {
        mapItemsMap.set(itemName, -this.getItemAmountInWarehouse(itemName));
      }

      const countBefore = mapItemsMap.get(itemName)!;
      count += countBefore;
      if (count <= 0) {
        countAdded = 0;
      } else if (countBefore < 0) {
        countAdded = count;
      } else {
        countAdded = count - countBefore;
      }
      mapItemsMap.set(itemName, count);
      return countAdded;
    }

    private mapClicked(map: string) {
      this.lootDialog = true;
      this.lootDialogMap = map;
    }

    private doLevelUp() {
      if (this.checkLevelUp()) {
        this.showDialog = false;
        this.items.forEach((item) => {
          this.$store.commit(Mutations.ChangeItem, {
            item: item.item,
            amount: -item.amount,
          });
        });
        switch (this.levelUp.type) {
          case LevelUpType.PROMOTE:
            this.$store.commit(Mutations.SetPromote, {
              agent: this.levelUp.agent,
              targetPromote: this.levelUp.promoteTo,
            });
            break;
          case LevelUpType.SKILL:
            this.$store.commit(Mutations.SetSkillLevel, {
              agent: this.levelUp.agent,
              targetSkillLevel: this.levelUp.skillUpTo,
            });
            break;
          case LevelUpType.SPECIALIZE:
            const index = this.agentDetails[this.levelUp.agent].skillSpecializeItems.findIndex((specialize) => specialize.skillName === this.levelUp.specializeTarget!.specializeSkill);
            this.$store.commit(Mutations.SetSpecializeRank, {
              agent: this.levelUp.agent,
              index: index,
              targetSpecializeRank: this.levelUp.specializeTarget!.specializeRankTo,
            });
        }
      } else {
        this.snackbar = true;
      }
    }

    private checkLevelUp(): boolean {
      const anyItemNotEnough = this.items.filter((item) => item.amount > this.getItemAmountInWarehouse(item.item)).length > 0;
      if (anyItemNotEnough) {
        this.snackbarMessage = '材料不足';
        return false;
      }

      const agentData: AgentData = this.$store.getters[Getters.AgentData](this.levelUp.agent);
      switch (this.levelUp.type) {
        case LevelUpType.PROMOTE:
          this.snackbarMessage = `请先升至精英化${this.levelUp.promoteTo! - 1}`;
          return this.levelUp.promoteTo === (agentData.promote + 1);
        case LevelUpType.SKILL:
          this.snackbarMessage = `请先将技能升级至${this.levelUp.skillUpTo! - 1}`;
          return this.levelUp.skillUpTo === (agentData.skillLevel + 1);
        case LevelUpType.SPECIALIZE:
          this.snackbarMessage = `请先将${this.levelUp.specializeTarget!.specializeSkill}升级至Rank ${this.levelUp.specializeTarget!.specializeRankTo - 1}`;
          const index = this.agentDetails[this.levelUp.agent].skillSpecializeItems.findIndex((specialize) => specialize.skillName === this.levelUp.specializeTarget!.specializeSkill);
          return this.levelUp.specializeTarget!.specializeRankTo === agentData.skillSpecialize[index] + 1;
      }
    }

    private compositeOne(item: Item) {
      this.composite({item, amount: 1});
    }

    private composite(item: ItemAmount) {
      const canComposite = this.checkComposite(item);

      if (!canComposite) {
        this.snackbar = true;
        return;
      }
      this.$store.commit(Mutations.ChangeItem, {item: item.item, amount: item.amount});
      this.itemDetails[item.item].composite!.forEach((toComposite) => {
        this.$store.commit(Mutations.ChangeItem, {item: toComposite.item, amount: -item.amount * toComposite.amount});
      });

      this.calculateSuggestion();
    }

    private checkComposite(item: ItemAmount): boolean {
      if (this.itemDetails[item.item].composite) {
        const compositeItems: Array<ItemAmount> = this.itemDetails[item.item].composite!;
        const isItemEnough = compositeItems.filter((toComposite) => {
          return (this.getItemAmountInWarehouse(toComposite.item)) < (toComposite.amount * item.amount);
        }).length === 0;
        if (!isItemEnough) {
          this.snackbarMessage = '材料不足';
        }
        return isItemEnough;
      } else {
        this.snackbarMessage = '无法合成';
        return false;
      }
    }

    private getItemAmountInWarehouse(item: Item) {
      return this.warehouseItemCounts[item] || 0;
    }

    private compositeClass(compositeItem: ItemAmount, itemCount: number): { [className: string]: boolean } {
      const warehouseAmount = this.getItemAmountInWarehouse(compositeItem.item);
      return {
        'red--text': compositeItem.amount > warehouseAmount,
        'green--text': compositeItem.amount * itemCount <= warehouseAmount,
      };
    }
  }
</script>
