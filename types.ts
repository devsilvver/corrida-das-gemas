import React from 'react';

export enum Rarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export interface Character {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  // Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error in a .ts file.
  icon: React.ReactElement;
  baseDamage: number;
  abilityId?: 'CULTIST' | 'TELEPORT_MAGE' | 'FOREST_FAIRY' | 'JESTER' | 'PRIESTESS';
}

export interface UnitOnBoard {
  id: number;
  character: Character;
  level: number;
  row: number;
  col: number;
  abilityCooldownUntil?: number;
  attackCooldownUntil?: number;
}

export type EnemyType = 'common' | 'shielded' | 'boss';

export interface Enemy {
  id: number;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speed: number;
  pathIndex: number;
  x: number;
  y: number;
}

export interface DamageIndicator {
  id: number;
  amount: number;
  x: number;
  y: number;
  timestamp: number;
}