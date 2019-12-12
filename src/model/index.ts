import {PromoteLevel, SkillLevel, SkillSpecializeRank} from '@/store';

export interface AgentDetail {
  name: string;
  nameEN: string;
  category: AgentCategory;
  stars: number;
  promoteItems: {
    level1?: Array<ItemAmount>;
    level2?: Array<ItemAmount>;
  };
  skillLevelUpItems: {
    level2: Array<ItemAmount>;
    level3: Array<ItemAmount>;
    level4: Array<ItemAmount>;
    level5: Array<ItemAmount>;
    level6: Array<ItemAmount>;
    level7: Array<ItemAmount>;
  };
  skillSpecializeItems: Array<SkillSpecializeItems>
}

export interface SkillSpecializeItems {
  skillName: string;
  rank1: Array<ItemAmount>;
  rank2: Array<ItemAmount>;
  rank3: Array<ItemAmount>;
}

export interface ItemAmount {
  item: Item;
  amount: number;
}

export interface ItemDetail {
  suggest: SuggestType;
  map?: Array<BattleMap>
  composite?: Array<ItemAmount>;
}

export interface LevelUp {
  type: LevelUpType;
  agent: Agent;
  promoteTo?: PromoteLevel;
  skillUpTo?: SkillLevel;
  specializeTarget?: {
    specializeSkill: string;
    specializeRankTo: SkillSpecializeRank;
  }
}

export enum LevelUpType {
  PROMOTE = 'PROMOTE',
  SKILL = 'SKILL',
  SPECIALIZE = 'SPECIALIZE',
}

export const AllMap = ['1-7'];
export type BattleMap = typeof AllMap[number];

export const AllSuggest = ['map', 'composite'];
export type SuggestType = typeof AllSuggest[number];

export const AllAgents = ['能天使'];
export type Agent = typeof AllAgents[number];

export const AllAgentCategories = ['狙击干员'];
export type AgentCategory = typeof AllAgentCategories[number];
export const AllItems: Array<string> = [
  '龙门币', '双酮', '酮凝集', '酮凝集组', '酮阵列', '异铁碎片', '异铁', '异铁组', '异铁块', '代糖', '糖', '糖组', '糖聚块', '酯原料', '聚酸酯', '聚酸酯组', '聚酸酯块', '破损装置', '装置', '全新装置', '改量装置', '源岩', '固源岩', '固源岩组', '提纯源岩', 'RMA70-12', 'RMA70-24', '研磨石', '五水研磨石', '轻锰矿', '三水锰矿', '扭转醇', '白马醇', '聚合剂', '双极纳米片', 'D32钢', '技巧概要·卷1', '技巧概要·卷2', '技巧概要·卷3'];
export type Item = typeof AllItems[number];
