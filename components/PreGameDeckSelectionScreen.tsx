
import React, { useState } from 'react';
import type { Character } from '../types';
import type { GameMode } from '../App';

interface PreGameDeckSelectionScreenProps {
  savedDecks: Character[][];
  gameMode: GameMode;
  onStartGame: (deck: Character[]) => void;
  onBack: () => void;
}

const DeckSlot: React.FC<{deck: Character[], onClick: () => void, isSelected: boolean}> = ({ deck, onClick, isSelected }) => {
    const selectionClass = isSelected ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-slate-600';
    const isValid = deck.length > 0;
    
    return (
        <button 
            onClick={onClick} 
            disabled={!isValid}
            className={`w-full h-24 bg-slate-700/50 rounded-lg flex items-center justify-center p-2 gap-2 border-2 ${selectionClass} hover:border-yellow-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50`}
        >
            {!isValid && <span className="text-slate-400 text-lg">Deck Vazio</span>}
            {isValid && deck.map(char => (
                <div key={char.id} className="w-10 h-10" title={char.name}>
                    {char.icon}
                </div>
            ))}
        </button>
    );
};

const PreGameDeckSelectionScreen: React.FC<PreGameDeckSelectionScreenProps> = ({ savedDecks, gameMode, onStartGame, onBack }) => {
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    const handleStart = () => {
        if (selectedSlot !== null && savedDecks[selectedSlot]?.length > 0) {
            onStartGame(savedDecks[selectedSlot]);
        }
    };

    const canStart = selectedSlot !== null && savedDecks[selectedSlot]?.length > 0;

    return (
        <div className="w-full max-w-md h-[90vh] bg-slate-800/80 rounded-lg p-4 flex flex-col">
            <h2 className="text-center text-3xl font-bold text-yellow-300 mb-4">
                Selecione um Deck para {gameMode === 'pvp' ? 'PvP' : 'Treino'}
            </h2>
            <div className="flex-grow flex flex-col gap-3">
                {savedDecks.map((deck, index) => (
                    <DeckSlot 
                        key={index} 
                        deck={deck} 
                        onClick={() => setSelectedSlot(index)} 
                        isSelected={selectedSlot === index} 
                    />
                ))}
            </div>
            <div className="mt-4 flex flex-col items-center gap-2">
                <button
                    onClick={handleStart}
                    disabled={!canStart}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                    Iniciar Batalha
                </button>
                 <button onClick={onBack} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg text-lg transition-colors">
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default PreGameDeckSelectionScreen;
