
import React, { useState, useMemo } from 'react';
import type { Character, UnitOnBoard, Enemy, DamageIndicator } from '../types';
import { BOARD_ROWS, BOARD_COLS, MAX_LEVEL } from '../constants';
import Unit from './Unit';
import EnemyComponent from './Enemy';
import DamageIndicatorComponent from './DamageIndicator';
import { p2pService } from '../p2p';

interface GameBoardProps {
  board: UnitOnBoard[];
  setBoard: React.Dispatch<React.SetStateAction<UnitOnBoard[]>>;
  enemies: Enemy[];
  isPlayer: boolean;
  path: { x: number; y: number }[];
  damageIndicators: DamageIndicator[];
  attackingUnits: Map<number, number>;
  getNextUnitId?: () => number;
  playerDeck?: Character[];
  setPlayerMana?: React.Dispatch<React.SetStateAction<number>>;
  isPvp: boolean;
  performMerge: (unit1: UnitOnBoard, unit2: UnitOnBoard) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, setBoard, enemies, isPlayer, path, damageIndicators, attackingUnits, getNextUnitId, playerDeck, setPlayerMana, isPvp, performMerge }) => {
  const [draggedUnit, setDraggedUnit] = useState<UnitOnBoard | null>(null);

  const handleDragStart = (unit: UnitOnBoard) => {
    if (!isPlayer) return;
    setDraggedUnit(unit);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (row: number, col: number) => {
    if (!draggedUnit || !isPlayer) return;
    
    const targetUnit = board.find(u => u.row === row && u.col === col);
    
    // Do not drop on itself
    if (targetUnit && targetUnit.id === draggedUnit.id) {
        setDraggedUnit(null);
        return;
    }

    if (!targetUnit) { // Moving is not allowed, so do nothing.
      setDraggedUnit(null);
      return;
    }

    if (isPvp) {
      if (
        (draggedUnit.character.id === targetUnit.character.id && draggedUnit.level === targetUnit.level) ||
        (draggedUnit.character.abilityId === 'FOREST_FAIRY' && draggedUnit.level === targetUnit.level) ||
        (targetUnit.character.abilityId === 'FOREST_FAIRY' && draggedUnit.level === targetUnit.level) ||
        draggedUnit.character.abilityId === 'JESTER' ||
        draggedUnit.character.abilityId === 'TELEPORT_MAGE'
      ) {
         p2pService.sendMessage({ type: 'request_merge', payload: { unit1Id: draggedUnit.id, unit2Id: targetUnit.id } });
      }
      setDraggedUnit(null);
      return;
    }


    // --- Special Interactions (Local Play) ---
    if (targetUnit.level === draggedUnit.level) {
      const draggedAbility = draggedUnit.character.abilityId;
      const targetAbility = targetUnit.character.abilityId;

      // 1. Bobo da Corte (Jester) copies target
      if (draggedAbility === 'JESTER') {
        setBoard(prevBoard => {
          const boardWithoutJester = prevBoard.filter(u => u.id !== draggedUnit.id);
          const clonedUnit: UnitOnBoard = {
            ...targetUnit,
            id: getNextUnitId!(),
            row: draggedUnit.row,
            col: draggedUnit.col,
          };
          return [...boardWithoutJester, clonedUnit];
        });
        setDraggedUnit(null);
        return;
      }
      
      // 2. Mago do Teleporte (Teleport Mage) swaps with target
      if (draggedAbility === 'TELEPORT_MAGE' && targetUnit.character.id !== draggedUnit.character.id) {
         const cooldownEnd = Date.now() + 5000;
         setBoard(prevBoard => prevBoard.map(u => {
            if (u.id === draggedUnit.id) return { ...u, row: targetUnit.row, col: targetUnit.col, abilityCooldownUntil: cooldownEnd };
            if (u.id === targetUnit.id) return { ...u, row: draggedUnit.row, col: draggedUnit.col };
            return u;
         }));
         setDraggedUnit(null);
         return;
      }

      // 3. Fada do Bosque (Forest Fairy) wildcard merge
      if (draggedAbility === 'FOREST_FAIRY' || targetAbility === 'FOREST_FAIRY') {
        if (draggedUnit.level < MAX_LEVEL) {
            performMerge(draggedUnit, targetUnit);
        }
        setDraggedUnit(null);
        return;
      }
    }


    // Standard Merge (with new random rule)
    if (targetUnit && targetUnit.character.id === draggedUnit.character.id && targetUnit.level === draggedUnit.level && targetUnit.level < MAX_LEVEL) {
      performMerge(draggedUnit, targetUnit);
    }
    
    setDraggedUnit(null);
  };
  
  const TILE_SIZE_W_PERCENT = 100 / BOARD_COLS;
  const TILE_SIZE_H_PERCENT = 100 / BOARD_ROWS;

  const renderGrid = () => {
    const tiles = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        tiles.push(
          <div
            key={`${r}-${c}`}
            className="w-full h-full border border-slate-700/30"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(r, c)}
          ></div>
        );
      }
    }
    return tiles;
  };
  
  const portalPosition = path[path.length - 1];

  return (
    <div className="relative w-[250px] aspect-[5/3]">
      {/* Portal at the end of the path */}
      <div 
          className="absolute w-8 h-8 bg-purple-800 rounded-full animate-pulse z-0"
          style={{
              left: `calc(${portalPosition.x * TILE_SIZE_W_PERCENT}% + ${TILE_SIZE_W_PERCENT / 2}%)`,
              top: `calc(${portalPosition.y * TILE_SIZE_H_PERCENT}% + ${TILE_SIZE_H_PERCENT / 2}%)`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px #6b21a8, inset 0 0 10px #3b0764'
          }}
      />
      {/* Render enemies outside the grid container */}
      {enemies.map(enemy => (
          <EnemyComponent key={enemy.id} enemy={enemy} />
      ))}
      {/* Render damage indicators */}
      {damageIndicators.map(indicator => (
        <DamageIndicatorComponent key={indicator.id} indicator={indicator} />
      ))}
      
      <div 
        className="relative grid h-full w-full rounded-md border-2 border-slate-500"
        style={{
          gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)`,
          backgroundColor: '#111827',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
        }}
      >
        {renderGrid()}
        
        {board.map(unit => (
          <Unit 
            key={unit.id} 
            unit={unit}
            board={board}
            onDragStart={handleDragStart} 
            isPlayer={isPlayer} 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isAttacking={attackingUnits.has(unit.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
