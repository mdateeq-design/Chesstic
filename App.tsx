import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TicTacToePage from './pages/TicTacToePage';
import ChessPage from './pages/ChessPage';
import { SettingsProvider } from './contexts/SettingsContext';
import Settings from './components/Settings';

function App() {
  return (
    <SettingsProvider>
      <div className="w-full h-full bg-slate-900 font-sans antialiased text-white">
        <div className="relative isolate w-full h-full max-w-lg mx-auto bg-slate-900 shadow-2xl shadow-purple-500/10">
          <div 
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" 
            aria-hidden="true"
          >
            <div 
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
              style={{
                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
            ></div>
          </div>

          <Settings />

          <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen h-full">
            <HashRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tic-tac-toe" element={<TicTacToePage />} />
                <Route path="/chess" element={<ChessPage />} />
              </Routes>
            </HashRouter>
          </main>
          <div 
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" 
            aria-hidden="true"
          >
            <div 
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
            ></div>
          </div>
        </div>
      </div>
    </SettingsProvider>
  );
}

export default App;