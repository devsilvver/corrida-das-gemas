import React from 'react';
import type { DamageIndicator } from '../types';
import { BOARD_COLS, BOARD_ROWS } from '../constants';

interface DamageIndicatorProps {
  indicator: DamageIndicator;
}

const DamageIndicatorComponent: React.FC<DamageIndicatorProps> = ({ indicator }) => {
  return (
    <div
      className="absolute text-yellow-400 font-bold text-sm pointer-events-none animate-damage z-10"
      style={{
        left: `calc(${indicator.x / BOARD_COLS * 100}% + ${(100 / BOARD_COLS / 2)}%)`,
        top: `calc(${indicator.y / BOARD_ROWS * 100}% + ${(100 / BOARD_ROWS / 2)}%)`,
        transform: `translate(-50%, -100%)`, // Position above the enemy
        textShadow: '0 0 5px black, 0 0 3px black',
      }}
    >
      {indicator.amount}
    </div>
  );
};

export default DamageIndicatorComponent;
