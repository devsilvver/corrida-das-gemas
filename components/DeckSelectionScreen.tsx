
import React, { useState } from 'react';
import type { Character } from '../types';
import { Rarity } from '../types';
import { DECK_SIZE, RARITY_COLORS } from '../constants';
import CharacterCard from './CharacterCard';

interface DeckSelectionScreenProps {
  allCharacters: Character[];
  onDeckSelect: (deck: Character[]) => void;
}

const rarityTranslation: { [key in Rarity]: string } = {
    [Rarity.Common]: 'Comum',
    [Rarity.Rare]: 'Raro',
    [Rarity.Epic]: 'Épico',
    [Rarity.Legendary]: 'Lendário',
}

const DeckSelectionScreen: React.FC<DeckSelectionScreenProps> = ({ allCharacters, onDeckSelect }) => {
  const [selectedDeck, setSelectedDeck] = useState<Character[]>([]);

  const handleSelectCharacter = (character: Character) => {
    setSelectedDeck(prevDeck => {
      if (prevDeck.find(c => c.id === character.id)) {
        return prevDeck.filter(c => c.id !== character.id);
      }
      if (prevDeck.length < DECK_SIZE) {
        return [...prevDeck, character];
      }
      return prevDeck;
    });
  };

  const isSelected = (character: Character) => {
    return selectedDeck.some(c => c.id === character.id);
  };

  const renderCharacterList = (rarity: Rarity) => (
    <div key={rarity}>
      <h3 className={`text-2xl font-bold ${RARITY_COLORS[rarity].text} my-2`}>{rarityTranslation[rarity]}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {allCharacters
          .filter(c => c.rarity === rarity)
          .map(character => (
            <CharacterCard 
              key={character.id} 
              character={character} 
              onClick={() => handleSelectCharacter(character)}
              isSelected={isSelected(character)}
            />
          ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl h-[80vh] bg-slate-800/80 rounded-lg p-4 flex flex-col">
      <h2 className="text-center text-3xl font-bold text-yellow-300 mb-4">Escolha Seus Heróis</h2>
      <div className="flex-grow overflow-y-auto pr-2">
        {Object.values(Rarity).reverse().map(rarity => renderCharacterList(rarity))}
      </div>
      <div className="mt-4 flex flex-col items-center">
        <p className="text-lg mb-2">Selecionados: {selectedDeck.length} / {DECK_SIZE}</p>
        <button
          onClick={() => onDeckSelect(selectedDeck)}
          disabled={selectedDeck.length !== DECK_SIZE}
          className="w-full max-w-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          Iniciar Batalha
        </button>
      </div>
    </div>
  );
};

export default DeckSelectionScreen;