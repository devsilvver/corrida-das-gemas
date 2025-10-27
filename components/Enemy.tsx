import React from 'react';
import type { Enemy } from '../types';
import { BOARD_COLS, BOARD_ROWS } from '../constants';

interface EnemyProps {
  enemy: Enemy;
}

const EnemyComponent: React.FC<EnemyProps> = ({ enemy }) => {
  const healthPercentage = (enemy.hp / enemy.maxHp) * 100;

  const getEnemyStyle = () => {
    switch(enemy.type) {
        case 'shielded':
            return {
                colorClasses: 'bg-purple-800 border-purple-500',
                sizeClasses: 'w-[30px] h-[30px]',
                shapeStyle: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }
            };
        case 'boss':
            return {
                colorClasses: 'bg-gray-900 border-yellow-400',
                sizeClasses: 'w-[45px] h-[45px]',
                shapeStyle: { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }
            };
        case 'common':
        default:
             return {
                colorClasses: 'bg-red-800 border-red-500',
                sizeClasses: 'w-[30px] h-[30px]',
                shapeStyle: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }
            };
    }
  };

  const { colorClasses, sizeClasses, shapeStyle } = getEnemyStyle();

  // Helper to format large HP numbers for bosses
  const formatHp = (hp: number): string => {
    const roundedHp = Math.round(hp);
    if (roundedHp >= 1000) {
        return `${(roundedHp / 1000).toFixed(1)}k`;
    }
    return roundedHp.toString();
  }
  
  return (
    <div
      className={`absolute transition-all duration-100 linear z-10 ${sizeClasses}`}
      style={{
        left: `calc(${enemy.x / BOARD_COLS * 100}% + ${(100 / BOARD_COLS / 2)}%)`,
        top: `calc(${enemy.y / BOARD_ROWS * 100}% + ${(100 / BOARD_ROWS / 2)}%)`,
        transform: `translate(-50%, -50%)`,
      }}
    >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className={`w-full h-full border-2 ${colorClasses}`} style={shapeStyle}>
            </div>
            <div className={`absolute -bottom-2 w-full ${enemy.type === 'boss' ? 'h-2' : 'h-1.5'} bg-gray-600 rounded-full overflow-hidden border border-slate-800/50`}>
                <div className="h-full bg-green-500" style={{ width: `${healthPercentage}%` }}></div>
            </div>
            <div 
                className="absolute text-white font-bold whitespace-nowrap"
                style={{
                    bottom: enemy.type === 'boss' ? '-1.5rem' : '-1.2rem', // Position below the health bar
                    fontSize: enemy.type === 'boss' ? '0.8rem' : '0.7rem',
                    textShadow: '0 1px 3px black, 0 0 2px black'
                }}
            >
                {formatHp(enemy.hp)}
            </div>
        </div>
    </div>
  );
};

export default EnemyComponent;