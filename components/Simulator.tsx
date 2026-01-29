
import React, { useState, useEffect } from 'react';
import { MOCK_ASSETS } from '../constants';
import { Asset, UserProfile } from '../types';

interface SimulatorProps {
  user: UserProfile;
  onTrade: (symbol: string, amount: number, price: number) => void;
}

const Simulator: React.FC<SimulatorProps> = ({ user, onTrade }) => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(a => ({
        ...a,
        price: a.price * (1 + (Math.random() * 0.006 - 0.003))
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalCost = selectedAsset ? selectedAsset.price * quantity : 0;
  const canAfford = user.investingoBucks >= totalCost;
  const userHolds = user.portfolio[selectedAsset?.symbol || ''] || 0;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b-2 border-gray-100 pb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Paper Trading</h1>
          <p className="font-bold text-gray-400 text-lg">Master the market without losing a cent.</p>
        </div>
        <div className="bg-[#58cc02] text-white px-8 py-4 rounded-2xl border-b-8 border-[#46a302] flex items-center gap-4 shadow-sm animate-in fade-in zoom-in duration-500">
          <span className="text-3xl">💰</span>
          <span className="text-2xl font-black">${user.investingoBucks.toLocaleString()}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Market Watch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assets.map(asset => {
              const isLocked = user.level < asset.levelRequired;
              const isSelected = selectedAsset?.symbol === asset.symbol;
              return (
                <button
                  key={asset.symbol}
                  disabled={isLocked}
                  onClick={() => setSelectedAsset(asset)}
                  className={`relative flex items-center justify-between p-6 duo-card bg-white transition-all transform active:scale-95 ${
                    isLocked ? 'opacity-40 grayscale cursor-not-allowed bg-gray-50' : 
                    isSelected ? 'border-[#1cb0f6] bg-[#f0f9ff] scale-[1.02]' : 'hover:border-gray-300'
                  }`}
                >
                  <div className="text-left flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl bg-gray-100 text-[#1cb0f6]">
                        {asset.symbol[0]}
                    </div>
                    <div>
                      <p className="font-black text-xl text-gray-800">{asset.symbol}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl text-gray-800">${asset.price.toFixed(2)}</p>
                    <p className={`text-sm font-black ${asset.change >= 0 ? 'text-[#58cc02]' : 'text-[#ff4b4b]'}`}>
                      {asset.change >= 0 ? '▲' : '▼'} {Math.abs(asset.change).toFixed(2)}%
                    </p>
                  </div>
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="bg-gray-700 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase">Lvl {asset.levelRequired} Required</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white duo-card p-8 h-fit sticky top-28 shadow-lg min-w-[300px]">
          {selectedAsset ? (
            <div className="space-y-8">
              <div className="text-center pb-6 border-b-2 border-gray-50">
                <h3 className="font-black text-3xl text-gray-800 mb-2">{selectedAsset.symbol}</h3>
                <p className="text-[#1cb0f6] font-black text-2xl tracking-tight">${selectedAsset.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center justify-between px-2">
                <span className="font-black text-gray-400 uppercase text-xs tracking-widest">Order Amount</span>
                <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border-2 rounded-xl font-black text-gray-400 hover:bg-gray-50">-</button>
                    <span className="font-black text-2xl text-gray-800 w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border-2 rounded-xl font-black text-gray-400 hover:bg-gray-50">+</button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 space-y-3 border-2 border-gray-100">
                <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                  <span>Investment</span>
                  <span className="text-gray-800 font-black text-sm">${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                  <span>Current Holding</span>
                  <span className="text-gray-800 font-black text-sm">{userHolds} Shares</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => onTrade(selectedAsset.symbol, quantity, selectedAsset.price)}
                  disabled={!canAfford}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                    canAfford ? 'duo-btn-success' : 'bg-gray-100 border-b-4 border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Buy Shares
                </button>
                <button
                  onClick={() => onTrade(selectedAsset.symbol, -quantity, selectedAsset.price)}
                  disabled={userHolds < quantity}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                    userHolds >= quantity ? 'bg-[#ff4b4b] border-b-8 border-[#d33131] text-white hover:brightness-110 active:border-b-0 active:translate-y-2' : 'bg-white border-2 border-gray-100 text-gray-200 opacity-50'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center animate-in fade-in duration-700">
              <div className="text-7xl mb-6">📈</div>
              <p className="font-black text-gray-400 uppercase text-xs tracking-[0.2em] leading-loose">Choose a stock<br/>to start practicing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
