import React from 'react';
import type { Character } from './types';
import { Rarity } from './types';
import { SwordsmanIcon, ArcherIcon, KnightIcon, BomberIcon, RogueIcon, SpearmanIcon, FrostMageIcon, FireElementalIcon, PriestessIcon, EngineerIcon, WindNinjaIcon, ArcaneArcherIcon, GolemGuardianIcon, CultistIcon, TeleportMageIcon, ForestFairyIcon, JesterIcon } from './components/icons/CharacterIcons';

export const CHARACTERS: Character[] = [
  // Lendários
  { id: 'LEG_01', name: 'Cultista', rarity: Rarity.Legendary, description: 'Recebe bônus ao lado de outros Cultistas. Cercado no centro, libera seu poder total.', icon: <CultistIcon />, baseDamage: 150, abilityId: 'CULTIST' },
  { id: 'LEG_02', name: 'Fada do Bosque', rarity: Rarity.Legendary, description: 'Pode se fundir com qualquer unidade do mesmo nível.', icon: <ForestFairyIcon />, baseDamage: 50, abilityId: 'FOREST_FAIRY' },
  { id: 'LEG_03', name: 'Bobo da Corte', rarity: Rarity.Legendary, description: 'Arrastar para outra unidade cria uma cópia dela no lugar do Bobo.', icon: <JesterIcon />, baseDamage: 50, abilityId: 'JESTER' },
  // Épicos
  { id: 'EPI_01', name: 'Arqueiro Arcano', rarity: Rarity.Epic, description: 'Dispara flechas perfurantes que atingem múltiplos inimigos em linha.', icon: <ArcaneArcherIcon />, baseDamage: 120 },
  { id: 'EPI_02', name: 'Guardião Golem', rarity: Rarity.Epic, description: 'HP alto. Atordoa inimigos próximos ao ser fundido.', icon: <GolemGuardianIcon />, baseDamage: 90 },
  // Fix: Corrected typo in abilityId for TeleportMageIcon.
  { id: 'EPI_03', name: 'Mago do Teleporte', rarity: Rarity.Epic, description: 'Pode trocar de lugar com outra unidade do mesmo nível.', icon: <TeleportMageIcon />, baseDamage: 50, abilityId: 'TELEPORT_MAGE' },
  // Raros
  { id: 'RAR_01', name: 'Mago de Gelo', rarity: Rarity.Rare, description: 'Atrasa alvos únicos.', icon: <FrostMageIcon />, baseDamage: 55 },
  { id: 'RAR_02', name: 'Elemental de Fogo', rarity: Rarity.Rare, description: 'Causa dano em área aos inimigos próximos.', icon: <FireElementalIcon />, baseDamage: 85 },
  { id: 'RAR_03', name: 'Sacerdotisa', rarity: Rarity.Rare, description: 'Gera mana ao ser fundida. A quantidade aumenta com o nível.', icon: <PriestessIcon />, baseDamage: 50, abilityId: 'PRIESTESS' },
  { id: 'RAR_04', name: 'Engenheiro', rarity: Rarity.Rare, description: 'Dano alto, cadência de tiro moderada.', icon: <EngineerIcon />, baseDamage: 100 },
  { id: 'RAR_05', name: 'Ninja do Vento', rarity: Rarity.Rare, description: 'Velocidade de ataque muito alta, alvo único.', icon: <WindNinjaIcon />, baseDamage: 65 },
  // Comuns
  { id: 'COM_01', name: 'Espadachim', rarity: Rarity.Common, description: 'Dano corpo a corpo básico.', icon: <SwordsmanIcon />, baseDamage: 70 },
  { id: 'COM_02', name: 'Arqueiro', rarity: Rarity.Common, description: 'Dano à distância básico.', icon: <ArcherIcon />, baseDamage: 75 },
  { id: 'COM_03', name: 'Cavaleiro', rarity: Rarity.Common, description: 'HP mais alto, mas ataque mais lento.', icon: <KnightIcon />, baseDamage: 55 },
  { id: 'COM_04', name: 'Bombardeiro', rarity: Rarity.Common, description: 'Lança bombas que causam dano em uma pequena área.', icon: <BomberIcon />, baseDamage: 65 },
  { id: 'COM_05', name: 'Ladino', rarity: Rarity.Common, description: 'Tem chance de causar dano crítico.', icon: <RogueIcon />, baseDamage: 75 },
  { id: 'COM_06', name: 'Lanceiro', rarity: Rarity.Common, description: 'Alcance um pouco maior que outras unidades corpo a corpo.', icon: <SpearmanIcon />, baseDamage: 70 },
];

export const BOARD_ROWS = 3;
export const BOARD_COLS = 5;
export const DECK_SIZE = 5;
export const MAX_LEVEL = 6;
export const LEVEL_DAMAGE_MULTIPLIER = 1.75; // Cada nível causa 1.75x o dano do anterior
export const LEVEL_ATTACK_SPEED_MULTIPLIER = 1.25; // Cada nível ataca 1.25x mais rápido

export const GAME_TIMER_DURATION = 120; // 2 minutos
export const COMMON_ENEMY_BASE_HP = 150;
export const SHIELDED_ENEMY_BASE_HP = 400;
export const BOSS_BASE_HP = 20000;
export const SHIELDED_ENEMY_DAMAGE_REDUCTION = 0.5; // Recebe 50% menos dano

// Coordinate system for paths. A value of -0.5 corresponds to the top/left edge of the grid,
// and BOARD_DIM - 0.5 corresponds to the bottom/right edge.
// We add padding to move the path outside the grid borders.
const PATH_PADDING = 0.4;
const BORDER_X_START = -0.5 - PATH_PADDING;
const BORDER_Y_START = -0.5 - PATH_PADDING;
const BORDER_X_END = BOARD_COLS - 0.5 + PATH_PADDING;
const BORDER_Y_END = BOARD_ROWS - 0.5 + PATH_PADDING;


// Player's path around the board.
export const PLAYER_ARENA_PATH: { x: number; y: number }[] = [
    { x: BORDER_X_START, y: BORDER_Y_END },   // Start: bottom-left
    { x: BORDER_X_START, y: BORDER_Y_START },  // Corner: top-left
    { x: BORDER_X_END, y: BORDER_Y_START },   // Corner: top-right
    { x: BORDER_X_END, y: BORDER_Y_END },    // End: bottom-right portal
];

// Opponent's path around the board.
export const OPPONENT_ARENA_PATH: { x: number; y: number }[] = [
    { x: BORDER_X_START, y: BORDER_Y_START },  // Start: top-left
    { x: BORDER_X_START, y: BORDER_Y_END },   // Corner: bottom-left
    { x: BORDER_X_END, y: BORDER_Y_END },    // Corner: bottom-right
    { x: BORDER_X_END, y: BORDER_Y_START },   // End: top-right portal
];


export const RARITY_COLORS: { [key in Rarity]: { bg: string; border: string; text: string } } = {
  [Rarity.Common]: { bg: 'bg-slate-700', border: 'border-slate-500', text: 'text-white' },
  [Rarity.Rare]: { bg: 'bg-blue-800', border: 'border-blue-500', text: 'text-white' },
  [Rarity.Epic]: { bg: 'bg-purple-800', border: 'border-purple-500', text: 'text-white' },
  [Rarity.Legendary]: { bg: 'bg-yellow-600', border: 'border-yellow-400', text: 'text-slate-900' },
};