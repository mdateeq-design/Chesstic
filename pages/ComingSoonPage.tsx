
import React from 'react';
import { Link } from 'react-router-dom';

interface ComingSoonPageProps {
  gameName: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ gameName }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
       <div className="absolute top-4 left-4">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">&larr; Back to Games</Link>
      </div>
      <div className="max-w-md">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">
          {gameName}
        </h1>
        <p className="text-2xl text-slate-300 mb-2">Coming Soon!</p>
        <p className="text-slate-400">
          Our team is hard at work building an amazing {gameName} experience for you.
          Check back later to challenge your friends and our AI!
        </p>
        <div className="mt-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-purple-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
