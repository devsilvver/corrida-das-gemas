
import React, { useState, useEffect, useCallback } from 'react';
import type { Character, UnitOnBoard, Enemy } from './types';
import { CHARACTERS, DECK_SIZE } from './constants';
import HomeScreen from './components/HomeScreen';
import DeckManagementScreen from './components/DeckManagementScreen';
import GameUI from './components/GameUI';
import GameOverModal from './components/GameOverModal';
import LobbyScreen from './components/LobbyScreen';
import { p2pService } from './p2p';

export type GamePhase = 'home' | 'deck-management' | 'playing' | 'game-over' | 'lobby';
export type GameMode = 'pve' | 'pvp' | 'training';

const App: React.FC = () => {
    const [gamePhase, setGamePhase] = useState<GamePhase>('home');
    const [gameMode, setGameMode] = useState<GameMode>('pve');
    
    const [savedDecks, setSavedDecks] = useState<Character[][]>(() => Array(5).fill([]));
    const [selectedDeckIndex, setSelectedDeckIndex] = useState<number | null>(null);
    const [playerDeck, setPlayerDeck] = useState<Character[]>([]);
    
    // Player State
    const [playerBoard, setPlayerBoard] = useState<UnitOnBoard[]>([]);
    const [playerMana, setPlayerMana] = useState<number>(100);
    const [playerHealth, setPlayerHealth] = useState<number>(3);
    const [summonCost, setSummonCost] = useState<number>(10);
    const [playerEnemies, setPlayerEnemies] = useState<Enemy[]>([]);
    
    // Opponent State
    const [opponentBoard, setOpponentBoard] = useState<UnitOnBoard[]>([]);
    const [opponentMana, setOpponentMana] = useState<number>(100);
    const [opponentHealth, setOpponentHealth] = useState<number>(3);
    const [opponentSummonCost, setOpponentSummonCost] = useState<number>(10);
    const [opponentEnemies, setOpponentEnemies] = useState<Enemy[]>([]);
    const [opponentDeck, setOpponentDeck] = useState<Character[]>([]);
    
    const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
    
    // PvP Lobby State
    const [lobbyId, setLobbyId] = useState<string | null>(null);
    const [isHost, setIsHost] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            const storedDeckIds = localStorage.getItem('gemRushDecks');
            if (storedDeckIds) {
                const parsedDeckIds = JSON.parse(storedDeckIds) as string[][];
                 if (Array.isArray(parsedDeckIds) && parsedDeckIds.length === 5 && parsedDeckIds.every(Array.isArray)) {
                   const hydratedDecks = parsedDeckIds.map(deckIds => 
                       deckIds.map(id => CHARACTERS.find(c => c.id === id)).filter((c): c is Character => c !== undefined)
                   );
                   setSavedDecks(hydratedDecks);
                }
            }
            const storedSelectedIndex = localStorage.getItem('gemRushSelectedDeckIndex');
            if (storedSelectedIndex) {
                const index = parseInt(storedSelectedIndex, 10);
                if (!isNaN(index) && index >= 0 && index < 5) {
                    setSelectedDeckIndex(index);
                }
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const lobbyParam = urlParams.get('lobby');
        if (lobbyParam) {
            setLobbyId(lobbyParam);
            setIsHost(false); // Guest joins from a link
            setGamePhase('deck-management'); 
            // Clean URL to avoid confusion on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleSaveDecks = (decks: Character[][]) => {
        setSavedDecks(decks);
        try {
            const deckIds = decks.map(deck => deck.map(character => character.id));
            localStorage.setItem('gemRushDecks', JSON.stringify(deckIds));
        } catch (error) {
            console.error("Failed to save decks to localStorage", error);
        }
    };

    const handleSelectDeck = (index: number) => {
        setSelectedDeckIndex(index);
        try {
            localStorage.setItem('gemRushSelectedDeckIndex', index.toString());
        } catch (error) {
            console.error("Failed to save selected deck index to localStorage", error);
        }
    };

    const resetGameState = useCallback(() => {
        setPlayerBoard([]);
        setPlayerMana(100);
        setPlayerHealth(3);
        setSummonCost(10);
        setPlayerEnemies([]);

        setOpponentBoard([]);
        setOpponentMana(100);
        setOpponentHealth(3);
        setOpponentSummonCost(10);
        setOpponentEnemies([]);
        setOpponentDeck([]);

        setWinner(null);
    }, []);
    
    const navigateTo = (phase: GamePhase) => {
        setGamePhase(phase);
    };

    const handleStartGame = (mode: GameMode) => {
        if (selectedDeckIndex === null || !savedDecks[selectedDeckIndex] || savedDecks[selectedDeckIndex].length !== DECK_SIZE) {
            alert("Por favor, selecione um deck válido na tela 'Meus Decks' antes de jogar.");
            return;
        }
        const deck = savedDecks[selectedDeckIndex];
        setGameMode(mode);
        setPlayerDeck(deck);
        resetGameState();
        if (mode === 'training') {
            setPlayerMana(9999);
        }
        setGamePhase('playing');
    };
    
    const handleStartPvpLobby = () => {
        if (selectedDeckIndex === null || !savedDecks[selectedDeckIndex] || savedDecks[selectedDeckIndex].length !== DECK_SIZE) {
            alert("Por favor, selecione um deck válido antes de criar um lobby PvP.");
            return;
        }
        const deck = savedDecks[selectedDeckIndex];
        setPlayerDeck(deck);

        const newLobbyId = `gemrush_${Date.now()}`;
        setLobbyId(newLobbyId);
        setIsHost(true);
        setGamePhase('lobby');
    };

    const handleConfirmDeckForLobby = (deck: Character[]) => {
        setPlayerDeck(deck);
        setGamePhase('lobby');
    };

    const handleEndGame = () => {
        setGamePhase('home');
        setPlayerDeck([]);
        p2pService.closeConnection();
        resetGameState();
    };

    // Game Over Logic
    useEffect(() => {
        if (gamePhase !== 'playing') return;
        const isOpponentActive = gameMode === 'pvp' || gameMode === 'pve';
        if (playerHealth <= 0) {
            setWinner(isOpponentActive ? 'opponent' : 'opponent'); // In training, you still 'lose'
            setGamePhase('game-over');
        } else if (isOpponentActive && opponentHealth <= 0) {
            setWinner('player');
            setGamePhase('game-over');
        }
    }, [playerHealth, opponentHealth, gamePhase, gameMode]);
    
    const renderContent = () => {
        const canPlay = selectedDeckIndex !== null && savedDecks[selectedDeckIndex] && savedDecks[selectedDeckIndex].length === DECK_SIZE;

        switch(gamePhase) {
            case 'home':
                return <HomeScreen onNavigate={navigateTo} onStartGame={handleStartGame} onStartPvpLobby={handleStartPvpLobby} canPlay={canPlay} />;
            case 'deck-management':
                return <DeckManagementScreen allCharacters={CHARACTERS} savedDecks={savedDecks} onSaveDecks={handleSaveDecks} onBack={() => navigateTo('home')} selectedDeckIndex={selectedDeckIndex} onSelectDeck={handleSelectDeck} isGuestInLobby={!isHost && !!lobbyId} onConfirmDeckForLobby={handleConfirmDeckForLobby} />;
            case 'lobby':
                return <LobbyScreen 
                    lobbyId={lobbyId!} 
                    isHost={isHost!} 
                    playerDeck={playerDeck}
                    onGameStart={(oppDeck) => {
                        setGameMode('pvp');
                        resetGameState();
                        setOpponentDeck(oppDeck);
                        setGamePhase('playing');
                    }}
                    onBack={() => {
                        setLobbyId(null);
                        setIsHost(null);
                        setGamePhase('home');
                    }}
                />
            case 'playing':
                 return (
                    <GameUI
                        gameMode={gameMode}
                        playerDeck={playerDeck}
                        playerBoard={playerBoard}
                        setPlayerBoard={setPlayerBoard}
                        playerMana={playerMana}
                        setPlayerMana={setPlayerMana}
                        playerHealth={playerHealth}
                        setPlayerHealth={setPlayerHealth}
                        summonCost={summonCost}
                        setSummonCost={setSummonCost}
                        playerEnemies={playerEnemies}
                        setPlayerEnemies={setPlayerEnemies}
                        opponentBoard={opponentBoard}
                        setOpponentBoard={setOpponentBoard}
                        opponentMana={opponentMana}
                        setOpponentMana={setOpponentMana}
                        opponentHealth={opponentHealth}
                        setOpponentHealth={setOpponentHealth}
                        opponentSummonCost={opponentSummonCost}
                        setOpponentSummonCost={setOpponentSummonCost}
                        opponentEnemies={opponentEnemies}
                        setOpponentEnemies={setOpponentEnemies}
                        opponentDeck={opponentDeck}
                    />
                );
            case 'game-over':
                return <GameOverModal winner={winner} onPlayAgain={handleEndGame} />;
            default:
                return <HomeScreen onNavigate={navigateTo} onStartGame={handleStartGame} onStartPvpLobby={handleStartPvpLobby} canPlay={canPlay} />;
        }
    }

    return (
        <div 
            className="w-screen h-screen bg-slate-900 flex flex-col items-center justify-center p-2"
        >
            <div className="w-full h-full flex flex-col items-center justify-center">
                {gamePhase === 'home' && (
                    <h1 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-4 tracking-wider" style={{textShadow: '0 0 10px #facc15, 0 0 20px #facc15'}}>
                      Corrida das Gemas
                    </h1>
                )}
                {renderContent()}
            </div>
        </div>
    );
};

export default App;
