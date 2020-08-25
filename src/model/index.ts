import {AllSkillLevel, PhaseLevel, SkillLevel} from '@/store';
import CharacterTable from '@/assets/ArknightsGameData/zh_CN/gamedata/excel/character_table.json';
import SkillTable from '@/assets/ArknightsGameData/zh_CN/gamedata/excel/skill_table.json';

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
  displayLogo: string;
  rarity: number;
  phases: Array<Phase>;
  skills: Array<Skill>;
  allSkillLvlup: Array<AllSkillLevelUpCostCond>;
  displayNumber: string | null;
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
  type?: ItemType;
}

export enum Profession {
  PIONEER = 'PIONEER',
  SNIPER = 'SNIPER',
  MEDIC = 'MEDIC',
  CASTER = 'CASTER',
  WARRIOR = 'WARRIOR',
  TANK = 'TANK',
  SUPPORT = 'SUPPORT',
  SPECIAL = 'SPECIAL',
  TOKEN = 'TOKEN',
  TRAP = 'TRAP',
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
  roomType: RoomType;
  formulaId: string;
}

export type RoomType = 'WORKSHOP' | 'MANUFACTURE';

export interface ItemStageDrop {
  stageId: string;
}

export enum ItemType {
  GOLD = 'GOLD',
  MATERIAL = 'MATERIAL',
}

export interface LevelUp {
  type: LevelUpType;
  characterId: string;
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

export const Skills: { [id: string]: SkillDetail } = SkillTable as { [id: string]: SkillDetail };

export const AllProfessions: Array<Profession> = [
  Profession.PIONEER, Profession.SNIPER, Profession.MEDIC, Profession.CASTER,
  Profession.WARRIOR, Profession.TANK, Profession.SUPPORT, Profession.SPECIAL,
];
