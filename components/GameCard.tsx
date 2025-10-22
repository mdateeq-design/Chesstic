import React from 'react';
import { Link } from 'react-router-dom';
import { useSounds } from '../hooks/useSounds';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, icon, path, color }) => {
  const shadowColor = `shadow-[0_0_15px_rgba(${color},0.5),_0_0_30px_rgba(${color},0.3)]`;
  const hoverShadowColor = `hover:shadow-[0_0_20px_rgba(${color},0.7),_0_0_40px_rgba(${color},0.5)]`;
  const borderColor = `border-2 border-[rgba(${color},0.5)]`;
  const { playSound } = useSounds();

  return (
    <Link to={path} className="group w-full max-w-sm" onClick={() => playSound('click')}>
      <div 
        className={`
          relative bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl 
          ${borderColor}
          transition-all duration-300 transform 
          hover:-translate-y-2 
          ${shadowColor}
          ${hoverShadowColor}
        `}
      >
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg bg-slate-700/50 text-[rgba(${color},1)]`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;