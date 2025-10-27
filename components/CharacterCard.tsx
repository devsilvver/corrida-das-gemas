
import React from 'react';
import type { Character } from '../types';
import { RARITY_COLORS } from '../constants';

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
  isSelected: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick, isSelected }) => {
  const { bg, border, text } = RARITY_COLORS[character.rarity];
  const selectionClass = isSelected ? `ring-4 ring-offset-2 ring-offset-slate-900 ${border}` : '';

  return (
    <div
      onClick={onClick}
      className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${bg} ${border} ${selectionClass} transform hover:scale-105`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 mb-2 flex items-center justify-center">
            {character.icon}
        </div>
        <h4 className={`font-bold text-sm ${text}`}>{character.name}</h4>
        <p className="text-xs text-slate-300 mt-1">{character.description}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
