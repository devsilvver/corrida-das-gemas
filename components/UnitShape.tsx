import React from 'react';

const shapeBaseClasses = "w-full h-full flex items-center justify-center";

interface UnitShapeProps {
    level: number;
    bgColor: string;
    borderColor: string;
    children: React.ReactNode;
}

export const UnitShape: React.FC<UnitShapeProps> = ({ level, bgColor, borderColor, children }) => {
    const borderClasses = `border-2 ${borderColor}`;
    
    switch (level) {
        case 1: // Círculo
            return <div className={`${shapeBaseClasses} rounded-full ${bgColor} ${borderClasses}`}>{children}</div>;
        case 2: // Olho Diagonal
            return (
                <div
                    className={`${shapeBaseClasses} ${bgColor} ${borderClasses}`}
                    style={{
                        clipPath: 'ellipse(50% 25% at 50% 50%)',
                        transform: 'rotate(45deg)',
                    }}
                >
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ transform: 'rotate(-45deg)' }}
                    >
                        {children}
                    </div>
                </div>
            );
        case 3: // Triângulo
            return (
                 <div className={`${shapeBaseClasses} ${bgColor} ${borderClasses}`} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
                    {children}
                </div>
            );
        case 4: // Quadrado Diagonal (Losango)
            return (
                <div className={`${shapeBaseClasses} ${bgColor} ${borderClasses}`} style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                    {children}
                </div>
            );
        case 5: // Pentágono
            return (
                <div className={`${shapeBaseClasses} ${bgColor} ${borderClasses}`} style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}>
                    {children}
                </div>
            );
        case 6: // Hexágono
        default:
            return (
                <div className={`${shapeBaseClasses} ${bgColor} ${borderClasses}`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                    {children}
                </div>
            );
    }
};
