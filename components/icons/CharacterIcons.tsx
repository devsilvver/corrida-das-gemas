import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {children}
    </svg>
);

// Lendários
export const CultistIcon = () => <IconWrapper>
    <path d="M12 2a10 10 0 00-9.52 7.004A10.01 10.01 0 0012 22a10.01 10.01 0 009.52-12.996A10 10 0 0012 2zm0 4a6 6 0 110 12 6 6 0 010-12z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10a2 2 0 100 4 2 2 0 000-4z" />
</IconWrapper>;

export const ForestFairyIcon = () => <IconWrapper>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1" stroke="lightgreen" fill="lightgreen" />
    <path d="M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" />
</IconWrapper>;

export const JesterIcon = () => <IconWrapper>
    <path d="M12 2L2 8l10 14L22 8z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="14" r="2" />
</IconWrapper>;

// Épicos
export const ArcaneArcherIcon = () => <IconWrapper>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
</IconWrapper>;
export const GolemGuardianIcon = () => <IconWrapper>
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
    <rect x="9" y="9" width="6" height="6" rx="1"/>
</IconWrapper>;
export const TeleportMageIcon = () => <IconWrapper>
    <path d="M12 6a6 6 0 100 12 6 6 0 000-12z" />
    <path d="M12 12l5-5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12L7 7" strokeLinecap="round" strokeLinejoin="round" />
</IconWrapper>;

// Raros
export const FrostMageIcon = () => <IconWrapper>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round"/>
</IconWrapper>;
export const FireElementalIcon = () => <IconWrapper>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
</IconWrapper>;
export const PriestessIcon = () => <IconWrapper>
    <path d="M12 4v16m-8-8h16" strokeLinecap="round"/>
</IconWrapper>;
export const EngineerIcon = () => <IconWrapper>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
</IconWrapper>;
export const WindNinjaIcon = () => <IconWrapper>
    <path d="M4 12h16M4 12l6-6m-6 6l6 6" strokeLinecap="round" strokeLinejoin="round" />
</IconWrapper>;

// Comuns
export const SwordsmanIcon = () => <IconWrapper>
    <path d="M5 19L19 5M10 14l-5 5m14-5l-5 5M5 10L10 5" strokeLinecap="round" strokeLinejoin="round"/>
</IconWrapper>;
export const ArcherIcon = () => <IconWrapper>
    <path d="M5 12h14m-4-4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
</IconWrapper>;
export const KnightIcon = () => <IconWrapper>
    <rect x="6" y="3" width="12" height="18" rx="2" strokeWidth="2" />
</IconWrapper>;
export const BomberIcon = () => <IconWrapper>
    <circle cx="12" cy="12" r="7" />
    <path d="M17 7L19 5" strokeLinecap="round"/>
</IconWrapper>;
export const RogueIcon = () => <IconWrapper>
    <polygon points="12 2, 2 12, 12 22, 22 12" strokeLinejoin="round" />
</IconWrapper>;
export const SpearmanIcon = () => <IconWrapper>
    <path d="M4 4l16 16m-16 0L20 4" strokeLinecap="round" strokeLinejoin="round"/>
</IconWrapper>;