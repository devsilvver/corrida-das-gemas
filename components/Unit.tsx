import React, { useMemo, useState, useEffect } from 'react';
import type { UnitOnBoard } from '../types';
import { RARITY_COLORS, BOARD_COLS, BOARD_ROWS } from '../constants';
import { UnitShape } from './UnitShape';

interface UnitProps {
  unit: UnitOnBoard;
  board: UnitOnBoard[];
  onDragStart: (unit: UnitOnBoard) => void;
  isPlayer: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (row: number, col: number) => void;
  isAttacking: boolean;
}

const getCultistState = (unit: UnitOnBoard, board: UnitOnBoard[]): 'normal' | 'adjacent' | 'supreme' => {
    if (unit.character.abilityId !== 'CULTIST') return 'normal';

    // Check for cultists in the 4 adjacent (non-diagonal) positions
    const hasUp = !!board.find(u => u.row === unit.row - 1 && u.col === unit.col && u.character.abilityId === 'CULTIST');
    const hasDown = !!board.find(u => u.row === unit.row + 1 && u.col === unit.col && u.character.abilityId === 'CULTIST');
    const hasLeft = !!board.find(u => u.row === unit.row && u.col === unit.col - 1 && u.character.abilityId === 'CULTIST');
    const hasRight = !!board.find(u => u.row === unit.row && u.col === unit.col + 1 && u.character.abilityId === 'CULTIST');

    // Supreme form: surrounded on all 4 adjacent sides by Cultists.
    if (hasUp && hasDown && hasLeft && hasRight) {
        return 'supreme';
    }
    
    // Adjacent form: at least one adjacent (non-diagonal) Cultist.
    if (hasUp || hasDown || hasLeft || hasRight) {
        return 'adjacent';
    }

    return 'normal';
};


const Unit: React.FC<UnitProps> = ({ unit, board, onDragStart, isPlayer, onDragOver, onDrop, isAttacking }) => {
  const TILE_WIDTH = 100 / BOARD_COLS;
  const TILE_HEIGHT = 100 / BOARD_ROWS;
  
  const [remainingCooldown, setRemainingCooldown] = useState(0);

  useEffect(() => {
    if (unit.character.abilityId !== 'TELEPORT_MAGE' || !unit.abilityCooldownUntil) {
      setRemainingCooldown(0);
      return;
    }

    let intervalId: number | undefined;

    const updateCooldown = () => {
      const now = Date.now();
      const timeLeft = unit.abilityCooldownUntil! - now;
      if (timeLeft > 0) {
        setRemainingCooldown(Math.ceil(timeLeft / 1000));
      } else {
        setRemainingCooldown(0);
        if (intervalId) clearInterval(intervalId);
      }
    };
    
    updateCooldown();
    intervalId = window.setInterval(updateCooldown, 500);
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [unit.abilityCooldownUntil, unit.character.abilityId]);

  const isOnCooldown = remainingCooldown > 0;

  const cultistState = useMemo(() => getCultistState(unit, board), [unit, board]);

  const getUnitColors = () => {
    if (cultistState === 'supreme') {
        return { bg: 'bg-red-800', border: 'border-red-500', text: 'text-white' };
    }
    if (cultistState === 'adjacent') {
        return { bg: 'bg-orange-800', border: 'border-orange-500', text: 'text-white' };
    }
    return RARITY_COLORS[unit.character.rarity];
  }

  const { bg, border, text } = getUnitColors();

  return (
    <div
      draggable={isPlayer && !isOnCooldown}
      onDragStart={() => onDragStart(unit)}
      onDragOver={onDragOver}
      onDrop={(e) => {
        e.stopPropagation();
        onDrop(unit.row, unit.col);
      }}
      className="absolute flex items-center justify-center transition-all duration-300 z-20"
      style={{
        width: '40px',
        height: '40px',
        left: `calc(${unit.col * TILE_WIDTH}% + ${TILE_WIDTH / 2}%)`,
        top: `calc(${unit.row * TILE_HEIGHT}% + ${TILE_HEIGHT / 2}%)`,
        transform: 'translate(-50%, -50%)',
        cursor: isPlayer ? (isOnCooldown ? 'not-allowed' : 'grab') : 'default',
      }}
    >
      <div className={`relative w-full h-full transition-opacity ${isOnCooldown ? 'opacity-50' : ''} ${isAttacking ? 'animate-attack' : ''}`}>
        <UnitShape level={unit.level} bgColor={bg} borderColor={border}>
          <div className="w-full h-full text-white p-1">{unit.character.icon}</div>
        </UnitShape>
        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${bg} ${border} border-2 flex items-center justify-center`}>
            <span className={`text-xs font-bold ${text}`}>{unit.level}</span>
        </div>
         {isOnCooldown && (
           <div className="absolute inset-0 flex items-center justify-center z-30">
               <div className="w-6 h-6 bg-black/80 rounded-full flex items-center justify-center text-white font-bold text-sm border border-white">
                  {remainingCooldown}
               </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Unit;