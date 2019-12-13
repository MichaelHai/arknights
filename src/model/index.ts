import {PhaseLevel, AllSkillLevel, SkillLevel} from '@/store';
import CharacterTable from '@/assets/ArknightsGameData/excel/character_table.json';
import ItemTable from '@/assets/ArknightsGameData/excel/item_table.json';
import SkillTable from '@/assets/ArknightsGameData/excel/skill_table.json';

export interface SkillDetail {
  skillId: string;
  iconId: string | null;
  levels: Array<SkillLevelDetail>;
}

export interface SkillLevelDetail {
  name: string;
}

export interface CharacterDetail {
  name: string;
  appellation: string;
  profession: Profession;
  rarity: number;
  phases: Array<Phase>;
  skills: Array<Skill>;
  allSkillLvlup: Array<AllSkillLevelUpCostCond>
}

export enum ItemClassifyType {
  MATERIAL = 'MATERIAL',
}

export interface Skill {
  skillId: string;
  levelUpCostCond: Array<LevelUpCostCond>;
}

export interface AllSkillLevelUpCostCond {
  lvlUpCost: Array<CostItem>;
}

export interface LevelUpCostCond {
  levelUpCost: Array<CostItem>;
}

export interface Phase {
  evolveCost: Array<CostItem> | null;
}

export interface CostItem {
  id: string;
  count: number;
  type: CostType;
}

enum CostType {
  MATERIAL = 'MATERIAL',
}

enum Profession {
  SNIPER = 'SNIPER',
  CASTER = 'CASTER',
}

export interface ItemAmount {
  item: string;
  amount: number;
}

export interface ItemDetail {
  itemId: string;
  name: string;
  rarity: number;
  iconId: string;
  sortId: number,
  classifyType: ItemClassifyType;
  itemType: ItemType;
  stageDropList: Array<ItemStageDrop>;
  buildingProductList: Array<ItemBuildingProduct>;
}

export interface ItemBuildingProduct {
  formulaId: string;
}

export interface ItemStageDrop {
  stageId: string;
}

export enum ItemType {
  GOLD = 'GOLD',
  MATERIAL = 'MATERIAL',
}

export interface LevelUp {
  type: LevelUpType;
  agent: string;
  promoteTo?: PhaseLevel;
  skillUpTo?: AllSkillLevel;
  specializeTarget?: {
    specializeSkill: string;
    specializeRankTo: SkillLevel;
  }
}

export enum LevelUpType {
  PROMOTE = 'PROMOTE',
  SKILL = 'SKILL',
  SPECIALIZE = 'SPECIALIZE',
}

export const Characters: { [id: string]: CharacterDetail } = CharacterTable as { [id: string]: CharacterDetail };

export const Items: { [id: string]: ItemDetail } = ItemTable.items as { [id: string]: ItemDetail };
export const AllMaterials: Array<ItemDetail> = Object.values(Items)
  .filter((item) => item.itemType === ItemType.MATERIAL)
  .filter((item) => item.classifyType === ItemClassifyType.MATERIAL)
  .filter((item) => !item.itemId.startsWith('tier')) // 通用信物
  .filter((item) => !item.itemId.startsWith('p_char_')) // 信物
  .sort((item1, item2) => item1.sortId - item2.sortId);

export const Skills: { [id: string]: SkillDetail } = SkillTable as { [id: string]: SkillDetail };
