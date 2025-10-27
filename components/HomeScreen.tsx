
import React from 'react';
import type { GamePhase, GameMode } from '../App';

interface HomeScreenProps {
    onNavigate: (phase: GamePhase) => void;
    onStartGame: (mode: GameMode) => void;
    onStartPvpLobby: () => void;
    canPlay: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onStartGame, onStartPvpLobby, canPlay }) => {
    const playButtonClasses = "w-full text-white font-bold py-4 px-4 rounded-lg text-2xl transition-all duration-300 transform";
    const disabledClasses = "disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-60";
    
    return (
        <div className="w-full max-w-md flex flex-col items-center justify-center gap-4">
             <button
                onClick={() => onStartGame('pve')}
                disabled={!canPlay}
                title={!canPlay ? "Selecione um deck completo em 'Meus Decks' para jogar" : ""}
                className={`${playButtonClasses} bg-green-600 hover:bg-green-700 hover:scale-105 ${disabledClasses}`}
            >
                Jogar (PvE)
            </button>
            <button
                onClick={onStartPvpLobby}
                disabled={!canPlay}
                title={!canPlay ? "Selecione um deck completo em 'Meus Decks' para jogar" : ""}
                className={`${playButtonClasses} bg-purple-600 hover:bg-purple-700 hover:scale-105 ${disabledClasses}`}
            >
                Jogar PvP (Online)
            </button>
            <button
                onClick={() => onStartGame('training')}
                disabled={!canPlay}
                title={!canPlay ? "Selecione um deck completo em 'Meus Decks' para jogar" : ""}
                className={`${playButtonClasses} bg-blue-600 hover:bg-blue-700 hover:scale-105 ${disabledClasses}`}
            >
                Modo Treino
            </button>
            <button
                onClick={() => onNavigate('deck-management')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
            >
                Meus Decks
            </button>
        </div>
    );
};

export default HomeScreen;
