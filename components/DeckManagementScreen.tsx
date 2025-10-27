
import React, { useState, useMemo } from 'react';
import type { Character } from '../types';
import { Rarity } from '../types';
import { DECK_SIZE, RARITY_COLORS } from '../constants';
import CharacterCard from './CharacterCard';

interface DeckManagementScreenProps {
  allCharacters: Character[];
  savedDecks: Character[][];
  onSaveDecks: (decks: Character[][]) => void;
  onBack: () => void;
  selectedDeckIndex: number | null;
  onSelectDeck: (index: number) => void;
}

const rarityTranslation: { [key in Rarity]: string } = {
    [Rarity.Common]: 'Comum',
    [Rarity.Rare]: 'Raro',
    [Rarity.Epic]: 'Épico',
    [Rarity.Legendary]: 'Lendário',
}

const DeckSlot: React.FC<{
    deck: Character[];
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
}> = ({ deck, isSelected, onSelect, onEdit }) => {
    const selectionClass = isSelected ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-slate-600';
    const isValid = deck.length > 0;

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Impede que o onSelect do contêiner seja acionado
        onEdit();
    };

    return (
        <div 
            onClick={isValid ? onSelect : onEdit} 
            className={`relative w-full h-24 bg-slate-700/50 rounded-lg flex items-center justify-center p-2 gap-2 border-2 ${selectionClass} hover:border-yellow-300 transition-colors cursor-pointer`}
        >
            {!isValid ? (
                <span className="text-slate-400 text-lg">+ Criar Deck</span>
            ) : (
                deck.map(char => (
                    <div key={char.id} className="w-10 h-10" title={char.name}>
                        {char.icon}
                    </div>
                ))
            )}
            <button 
                onClick={handleEditClick}
                className="absolute top-2 right-2 bg-slate-800/80 hover:bg-slate-900 text-xs text-yellow-300 font-semibold py-1 px-2 rounded border border-slate-600 transition-colors"
            >
                Editar
            </button>
        </div>
    );
};

const DeckManagementScreen: React.FC<DeckManagementScreenProps> = ({ allCharacters, savedDecks, onSaveDecks, onBack, selectedDeckIndex, onSelectDeck }) => {
    const [editingSlot, setEditingSlot] = useState<number | null>(null);
    const [currentDeck, setCurrentDeck] = useState<Character[]>([]);

    const handleEditSlot = (index: number) => {
        setEditingSlot(index);
        setCurrentDeck(savedDecks[index] || []);
    };

    const handleSelectCharacter = (character: Character) => {
        setCurrentDeck(prevDeck => {
            if (prevDeck.find(c => c.id === character.id)) {
                return prevDeck.filter(c => c.id !== character.id);
            }
            if (prevDeck.length < DECK_SIZE) {
                return [...prevDeck, character];
            }
            return prevDeck;
        });
    };
    
    const handleSaveDeck = () => {
        if (editingSlot === null) return;
        const newDecks = [...savedDecks];
        newDecks[editingSlot] = currentDeck;
        onSaveDecks(newDecks);
        setEditingSlot(null);
    }
    
    const isSelected = (character: Character) => currentDeck.some(c => c.id === character.id);
    
    const renderCharacterList = (rarity: Rarity) => (
        <div key={rarity}>
            <h3 className={`text-xl font-bold ${RARITY_COLORS[rarity].text} my-2`}>{rarityTranslation[rarity]}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {allCharacters.filter(c => c.rarity === rarity).map(character => (
                <CharacterCard key={character.id} character={character} onClick={() => handleSelectCharacter(character)} isSelected={isSelected(character)}/>
            ))}
            </div>
        </div>
    );

    if (editingSlot !== null) {
        return (
            <div className="w-full max-w-4xl h-[90vh] bg-slate-800/80 rounded-lg p-4 flex flex-col">
                <h2 className="text-center text-3xl font-bold text-yellow-300 mb-2">{`Editando Deck ${editingSlot + 1}`}</h2>
                 <div className="flex-grow overflow-y-auto pr-2">
                    {Object.values(Rarity).reverse().map(rarity => renderCharacterList(rarity))}
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <p className="text-lg mb-2">Selecionados: {currentDeck.length} / {DECK_SIZE}</p>
                    <div className="flex w-full max-w-xs gap-2">
                        <button onClick={() => setEditingSlot(null)} className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors">Voltar</button>
                        <button onClick={handleSaveDeck} disabled={currentDeck.length !== DECK_SIZE} className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors">
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md h-[90vh] bg-slate-800/80 rounded-lg p-4 flex flex-col">
            <h2 className="text-center text-3xl font-bold text-yellow-300 mb-4">Meus Decks</h2>
            <p className="text-center text-slate-300 mb-4 text-sm">Clique em um deck para selecioná-lo para a batalha.</p>
            <div className="flex-grow flex flex-col gap-3">
                {savedDecks.map((deck, index) => (
                    <DeckSlot 
                        key={index} 
                        deck={deck} 
                        isSelected={selectedDeckIndex === index}
                        onSelect={() => onSelectDeck(index)}
                        onEdit={() => handleEditSlot(index)} 
                    />
                ))}
            </div>
            <div className="mt-4">
                <button onClick={onBack} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg text-xl transition-colors">
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default DeckManagementScreen;
