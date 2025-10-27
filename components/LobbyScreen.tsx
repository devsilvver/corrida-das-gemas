
import React, { useState, useEffect } from 'react';
import type { Character } from '../types';
import { p2pService } from '../p2p';

interface LobbyScreenProps {
    lobbyId: string;
    isHost: boolean;
    playerDeck: Character[];
    onGameStart: (opponentDeck: Character[]) => void;
    onBack: () => void;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ isHost, playerDeck, onGameStart, onBack }) => {
    const [connectionState, setConnectionState] = useState<'idle' | 'creating' | 'waiting_for_answer' | 'joining' | 'waiting_for_connection' | 'connected' | 'error'>('idle');
    const [offer, setOffer] = useState('');
    const [answer, setAnswer] = useState('');
    const [guestDeck, setGuestDeck] = useState<Character[] | null>(null);
    const [copyButtonText, setCopyButtonText] = useState('Copiar');
    const [error, setError] = useState('');

    useEffect(() => {
        p2pService.onMessage(message => {
            if (message.type === 'deck_share') {
                if (isHost) {
                    setGuestDeck(message.payload);
                }
            } else if (message.type === 'start_game' && !isHost) {
                // Host started the game, guest now sends their deck and starts
                p2pService.sendMessage({ type: 'deck_share', payload: playerDeck });
                onGameStart(message.payload); // payload is host's deck
            }
        });

        p2pService.onConnectionStateChange(state => {
            if (state === 'open') {
                setConnectionState('connected');
                // Exchange decks
                if (isHost) {
                    p2pService.sendMessage({ type: 'deck_share', payload: playerDeck });
                }
            } else if (state === 'closed') {
                setError('A conexão foi perdida.');
                setConnectionState('error');
            }
        });

        return () => p2pService.closeConnection();
    }, [isHost, onGameStart, playerDeck]);

    // Host: Create lobby offer on component mount
    useEffect(() => {
        if (isHost && connectionState === 'idle') {
            setConnectionState('creating');
            p2pService.createLobby().then(offerStr => {
                setOffer(offerStr);
                setConnectionState('waiting_for_answer');
            }).catch(() => {
                setError('Falha ao criar o lobby.');
                setConnectionState('error');
            });
        }
    }, [isHost, connectionState]);

    const handleJoin = async (offerStr: string) => {
        if (!isHost && offerStr) {
            try {
                setError('');
                setConnectionState('joining');
                const answerStr = await p2pService.joinLobby(offerStr);
                setAnswer(answerStr);
                setConnectionState('waiting_for_connection');
            } catch (e) {
                setError('Código da oferta inválido.');
                setConnectionState('idle');
            }
        }
    };

    const handleAcceptAnswer = async (answerStr: string) => {
        if (isHost && answerStr) {
            try {
                setError('');
                await p2pService.acceptAnswer(answerStr);
                // Connection will establish via onConnectionStateChange callback
            } catch (e) {
                setError('Código da resposta inválido.');
            }
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopyButtonText('Copiado!');
        setTimeout(() => setCopyButtonText('Copiar'), 2000);
    };

    const handleHostStartGame = () => {
        if (isHost && guestDeck) {
            // Tell guest to start, and send our deck
            p2pService.sendMessage({ type: 'start_game', payload: playerDeck });
            onGameStart(guestDeck);
        }
    };

    const renderPlayerDeck = (deck: Character[], title: string) => (
        <div className="w-full p-3 bg-slate-700/50 rounded-lg">
            <h4 className="text-center text-slate-300 mb-2">{title}</h4>
            <div className="flex items-center justify-center gap-2">
                {deck.map(char => (
                    <div key={char.id} className="w-10 h-10" title={char.name}>{char.icon}</div>
                ))}
            </div>
        </div>
    );

    const renderHostView = () => (
        <div className="w-full flex flex-col items-center gap-4">
            {connectionState === 'creating' && <p className="text-lg animate-pulse">Criando lobby...</p>}
            {connectionState === 'waiting_for_answer' && (
                <>
                    <h3 className="text-xl font-semibold">Lobby Criado!</h3>
                    <p>1. Copie o código abaixo e envie para seu amigo.</p>
                    <div className="w-full">
                        <textarea readOnly value={offer} className="w-full bg-slate-900 text-slate-300 p-2 rounded border border-slate-600 h-24 resize-none" />
                        <button onClick={() => handleCopy(offer)} className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">{copyButtonText}</button>
                    </div>
                    <p>2. Peça para ele te enviar o código de resposta e cole aqui:</p>
                    <textarea onChange={(e) => handleAcceptAnswer(e.target.value)} placeholder="Cole o código de resposta aqui..." className="w-full bg-slate-900 text-slate-300 p-2 rounded border border-slate-600 h-24 resize-none" />
                </>
            )}
            {connectionState === 'connected' && (
                <>
                    <p className="text-lg text-green-400">Oponente Conectado!</p>
                    {guestDeck ? renderPlayerDeck(guestDeck, "Deck do Oponente") : <p className="animate-pulse">Aguardando deck do oponente...</p>}
                    <button onClick={handleHostStartGame} disabled={!guestDeck} className="w-full max-w-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg text-xl transition-transform transform hover:scale-105">
                        Iniciar Batalha
                    </button>
                </>
            )}
        </div>
    );

    const renderGuestView = () => (
        <div className="w-full flex flex-col items-center gap-4">
            {connectionState === 'idle' && (
                <>
                    <h3 className="text-xl font-semibold">Entrar no Lobby</h3>
                    <p>1. Cole o código de oferta que seu amigo enviou:</p>
                    <textarea onChange={(e) => handleJoin(e.target.value)} placeholder="Cole o código de oferta aqui..." className="w-full bg-slate-900 text-slate-300 p-2 rounded border border-slate-600 h-24 resize-none" />
                </>
            )}
            {connectionState === 'joining' && <p className="text-lg animate-pulse">Conectando...</p>}
            {connectionState === 'waiting_for_connection' && (
                <>
                    <h3 className="text-xl font-semibold">Quase lá!</h3>
                    <p>2. Copie seu código de resposta e envie de volta para o anfitrião:</p>
                    <div className="w-full">
                        <textarea readOnly value={answer} className="w-full bg-slate-900 text-slate-300 p-2 rounded border border-slate-600 h-24 resize-none" />
                        <button onClick={() => handleCopy(answer)} className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">{copyButtonText}</button>
                    </div>
                </>
            )}
            {connectionState === 'connected' && (
                <p className="text-lg text-yellow-400 animate-pulse">Conectado! Aguardando o anfitrião iniciar a partida...</p>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-md h-[90vh] bg-slate-800/80 rounded-lg p-6 flex flex-col items-center justify-between text-center">
            <div>
                <h2 className="text-center text-3xl font-bold text-yellow-300 mb-4">Lobby PvP Online</h2>
                {renderPlayerDeck(playerDeck, "Seu Deck")}
            </div>
            
            {isHost ? renderHostView() : renderGuestView()}
            
            {error && <p className="text-red-400 mt-4">{error}</p>}
            
            <button onClick={onBack} className="w-full max-w-xs bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors mt-4">
                {isHost ? 'Cancelar Lobby' : 'Sair'}
            </button>
        </div>
    );
};

export default LobbyScreen;
