import React, { useState, useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import SettingsIcon from './icons/SettingsIcon';
import SoundOnIcon from './icons/SoundOnIcon';
import SoundOffIcon from './icons/SoundOffIcon';

const Settings = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isSoundEnabled, toggleSound } = useContext(SettingsContext);

    const handleToggleSound = () => {
        toggleSound();
    };

    return (
        <>
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={() => setIsOpen(prev => !prev)}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
                    aria-label="Open settings"
                >
                    <SettingsIcon />
                </button>
            </div>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="fixed top-16 right-4 w-64 bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-lg shadow-2xl z-50 p-4">
                        <h3 className="text-lg font-bold text-white mb-4">Settings</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300">Sound Effects</span>
                            <button
                                onClick={handleToggleSound}
                                className={`p-2 rounded-full transition-colors ${isSoundEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}
                                aria-label={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
                            >
                                {isSoundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Settings;
