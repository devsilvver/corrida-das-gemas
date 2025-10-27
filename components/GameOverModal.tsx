
import React from 'react';

interface GameOverModalProps {
  winner: 'player' | 'opponent' | null;
  onPlayAgain: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onPlayAgain }) => {
  const isPlayerWinner = winner === 'player';
  const message = isPlayerWinner ? "Vitória!" : "Derrota!";
  const colorClass = isPlayerWinner ? "text-green-400" : "text-red-500";
  const bgColorClass = isPlayerWinner ? "bg-green-500/10" : "bg-red-500/10";
  const borderColorClass = isPlayerWinner ? "border-green-400" : "border-red-500";

  return (
    <div className={`w-full max-w-md p-8 rounded-lg border-2 ${bgColorClass} ${borderColorClass} bg-slate-800`}>
      <div className="text-center">
        <h2 className={`text-5xl font-bold mb-4 ${colorClass}`}>{message}</h2>
        <p className="text-xl mb-8">
          {isPlayerWinner ? "Você esmagou seu oponente!" : "Seu oponente foi forte demais."}
        </p>
        <button
          onClick={onPlayAgain}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-lg text-xl transition-transform transform hover:scale-105"
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
