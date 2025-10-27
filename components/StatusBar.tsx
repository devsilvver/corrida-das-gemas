
import React from 'react';

interface StatusBarProps {
  health: number;
  mana: number;
  timer: number;
  isBossActive: boolean;
  isTraining: boolean;
}

const HeartIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const GridIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="4" height="4" />
        <rect x="9" y="3" width="4" height="4" />
        <rect x="3" y="9" width="4" height="4" />
        <rect x="9" y="9" width="4" height="4" />
    </svg>
);

const ClockIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);


const StatusBar: React.FC<StatusBarProps> = ({ health, mana, timer, isBossActive, isTraining }) => {
  
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString();
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };
  
  return (
    <div className="w-full flex flex-col items-center">
        <div className="w-full bg-slate-900/80 px-4 py-2 rounded-lg flex justify-between items-center text-md border border-slate-700">
            <div className="flex items-center gap-1.5">
              <HeartIcon className="w-5 h-5 text-red-500"/>
              <span className="font-bold text-lg">{health}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-300">
              <GridIcon className="w-5 h-5"/>
              <span className="font-bold text-lg">{isTraining ? 'Infinita' : mana}</span>
            </div>
            <div className="flex items-center gap-1">
               <span className={`font-bold text-lg w-20 text-center ${isBossActive ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
                   {isBossActive ? 'CHEFE!' : formatTime(timer)}
               </span>
            </div>
        </div>
    </div>
  );
};

export default StatusBar;
