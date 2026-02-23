import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Trophy,
  RotateCcw,
  CheckCircle,
  XCircle,
  ChevronRight,
  DollarSign,
  Percent,
  Users,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

type GameState = 'ready' | 'negotiating' | 'finished';

interface Investor {
  id: string;
  name: string;
  emoji: string;
  style: 'aggressive' | 'fair' | 'strategic';
  initialOffer: {
    amount: number;
    equity: number;
  };
}

interface Startup {
  id: string;
  name: string;
  description: string;
  asking: {
    amount: number;
    equity: number;
  };
  revenue: string;
  growth: string;
  valuation: number;
}

interface NegotiationRound {
  investorOffer: { amount: number; equity: number };
  yourCounter?: { amount: number; equity: number };
  message: string;
  accepted?: boolean;
}

const INVESTORS: Investor[] = [
  {
    id: 'mark',
    name: 'Mark Billionaire',
    emoji: '🦈',
    style: 'aggressive',
    initialOffer: { amount: 150000, equity: 25 },
  },
  {
    id: 'sara',
    name: 'Sara Ventures',
    emoji: '💼',
    style: 'strategic',
    initialOffer: { amount: 200000, equity: 20 },
  },
  {
    id: 'kevin',
    name: 'Kevin Money',
    emoji: '💰',
    style: 'aggressive',
    initialOffer: { amount: 200000, equity: 30 },
  },
];

const STARTUPS: Startup[] = [
  {
    id: 'foodtech',
    name: 'QuickBite',
    description: 'AI-powered meal prep subscription service',
    asking: { amount: 200000, equity: 10 },
    revenue: '$50K MRR',
    growth: '25% MoM',
    valuation: 2000000,
  },
  {
    id: 'saas',
    name: 'CloudSync Pro',
    description: 'Enterprise file collaboration platform',
    asking: { amount: 500000, equity: 15 },
    revenue: '$100K MRR',
    growth: '15% MoM',
    valuation: 3333333,
  },
  {
    id: 'consumer',
    name: 'PetPal',
    description: 'Smart pet health monitoring collar',
    asking: { amount: 300000, equity: 12 },
    revenue: '$30K MRR',
    growth: '40% MoM',
    valuation: 2500000,
  },
];

export const DealNegotiator: React.FC = () => {
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentStartup, setCurrentStartup] = useState<Startup | null>(null);
  const [currentInvestor, setCurrentInvestor] = useState<Investor | null>(null);
  const [rounds, setRounds] = useState<NegotiationRound[]>([]);
  const [counterOffer, setCounterOffer] = useState({ amount: 0, equity: 0 });
  const [score, setScore] = useState(0);
  const [dealsCompleted, setDealsCompleted] = useState(0);
  const [finalDeal, setFinalDeal] = useState<{ amount: number; equity: number } | null>(null);

  // Start a new negotiation
  const startNegotiation = useCallback(() => {
    const startup = STARTUPS[Math.floor(Math.random() * STARTUPS.length)];
    const investor = INVESTORS[Math.floor(Math.random() * INVESTORS.length)];

    setCurrentStartup(startup);
    setCurrentInvestor(investor);
    setRounds([{
      investorOffer: investor.initialOffer,
      message: `I'll offer you $${investor.initialOffer.amount.toLocaleString()} for ${investor.initialOffer.equity}% equity.`,
    }]);
    setCounterOffer({ amount: startup.asking.amount, equity: startup.asking.equity });
    setGameState('negotiating');
  }, []);

  // Submit counter offer
  const submitCounter = useCallback(() => {
    if (!currentInvestor || !currentStartup) return;

    const lastOffer = rounds[rounds.length - 1].investorOffer;

    // Calculate if investor accepts based on how close we are
    const askingValuation = counterOffer.amount / (counterOffer.equity / 100);
    const investorValuation = lastOffer.amount / (lastOffer.equity / 100);
    const difference = (askingValuation - investorValuation) / investorValuation;

    // Investor logic based on style
    let accepted = false;
    let newOffer = { amount: 0, equity: 0 };
    let message = '';

    if (difference <= 0.1) {
      // Close enough - accept
      accepted = true;
      message = `Deal! $${counterOffer.amount.toLocaleString()} for ${counterOffer.equity}%. Let's build something great!`;
    } else if (difference <= 0.3) {
      // Counter with compromise
      newOffer = {
        amount: Math.round((counterOffer.amount + lastOffer.amount) / 2 / 1000) * 1000,
        equity: Math.round((counterOffer.equity + lastOffer.equity) / 2),
      };
      message = `I can meet you halfway. $${newOffer.amount.toLocaleString()} for ${newOffer.equity}%. Final offer.`;
    } else if (rounds.length >= 3) {
      // Too many rounds - walk away
      message = `I'm out. Your valuation expectations are too high for me.`;
      setGameState('finished');
      setFinalDeal(null);
      return;
    } else {
      // Make a new offer
      const bump = currentInvestor.style === 'aggressive' ? 0.05 : 0.1;
      newOffer = {
        amount: Math.round(lastOffer.amount * (1 + bump) / 1000) * 1000,
        equity: lastOffer.equity - 1,
      };
      message = `Let me revise. $${newOffer.amount.toLocaleString()} for ${newOffer.equity}%. That's my best.`;
    }

    const newRound: NegotiationRound = {
      investorOffer: accepted ? counterOffer : newOffer,
      yourCounter: { ...counterOffer },
      message,
      accepted,
    };

    setRounds(prev => [...prev, newRound]);

    if (accepted) {
      // Calculate score
      const askedValuation = currentStartup.asking.amount / (currentStartup.asking.equity / 100);
      const gotValuation = counterOffer.amount / (counterOffer.equity / 100);
      const valuationScore = Math.round((gotValuation / askedValuation) * 100);
      const roundBonus = (4 - rounds.length) * 50; // Bonus for quick deals
      const totalScore = Math.max(0, valuationScore + roundBonus);

      setScore(prev => prev + totalScore);
      setDealsCompleted(prev => prev + 1);
      setFinalDeal(counterOffer);
      setGameState('finished');
    }
  }, [currentInvestor, currentStartup, counterOffer, rounds]);

  // Accept investor's offer
  const acceptOffer = useCallback(() => {
    if (!currentStartup) return;

    const lastOffer = rounds[rounds.length - 1].investorOffer;

    const askedValuation = currentStartup.asking.amount / (currentStartup.asking.equity / 100);
    const gotValuation = lastOffer.amount / (lastOffer.equity / 100);
    const valuationScore = Math.round((gotValuation / askedValuation) * 100);

    setScore(prev => prev + valuationScore);
    setDealsCompleted(prev => prev + 1);
    setFinalDeal(lastOffer);
    setGameState('finished');
  }, [currentStartup, rounds]);

  // Walk away
  const walkAway = useCallback(() => {
    setFinalDeal(null);
    setGameState('finished');
  }, []);

  // Reset for new round
  const playAgain = useCallback(() => {
    setRounds([]);
    setFinalDeal(null);
    startNegotiation();
  }, [startNegotiation]);

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Challenges</span>
          </button>

          {/* Game info */}
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#3B82F6]/20 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-[#3B82F6]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Deal Negotiator</h1>
            <p className="text-[#9CA3AF] mb-6 max-w-md mx-auto">
              Shark Tank style negotiation! You're pitching your startup to investors.
              Negotiate the best deal while maintaining a fair valuation.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              <div className="p-3 bg-[#0D0D12] rounded-xl">
                <DollarSign className="w-5 h-5 text-[#22C55E] mx-auto mb-1" />
                <p className="text-sm text-[#9CA3AF]">Get Funding</p>
              </div>
              <div className="p-3 bg-[#0D0D12] rounded-xl">
                <Percent className="w-5 h-5 text-[#F5C518] mx-auto mb-1" />
                <p className="text-sm text-[#9CA3AF]">Minimize Equity</p>
              </div>
              <div className="p-3 bg-[#0D0D12] rounded-xl">
                <TrendingUp className="w-5 h-5 text-[#3B82F6] mx-auto mb-1" />
                <p className="text-sm text-[#9CA3AF]">Max Valuation</p>
              </div>
            </div>

            <button
              onClick={startNegotiation}
              className="px-8 py-4 bg-[#3B82F6] text-white font-semibold rounded-xl hover:bg-[#2563EB] transition-colors"
            >
              Enter the Tank
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Negotiating screen
  if (gameState === 'negotiating' && currentStartup && currentInvestor) {
    const lastRound = rounds[rounds.length - 1];

    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-[#6B7280]">Round</p>
                <p className="text-lg font-bold text-white">{rounds.length}/3</p>
              </div>
            </div>
          </div>

          {/* Startup Info */}
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">{currentStartup.name}</h2>
                <p className="text-sm text-[#9CA3AF]">{currentStartup.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6B7280]">Asking</p>
                <p className="text-lg font-bold text-[#22C55E]">
                  ${currentStartup.asking.amount.toLocaleString()} for {currentStartup.asking.equity}%
                </p>
              </div>
            </div>
            <div className="flex gap-4 mt-3 text-sm">
              <span className="text-[#9CA3AF]">Revenue: <span className="text-white">{currentStartup.revenue}</span></span>
              <span className="text-[#9CA3AF]">Growth: <span className="text-[#22C55E]">{currentStartup.growth}</span></span>
            </div>
          </div>

          {/* Investor */}
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-3xl">
                {currentInvestor.emoji}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{currentInvestor.name}</h3>
                <p className="text-sm text-[#9CA3AF] capitalize">{currentInvestor.style} investor</p>
              </div>
            </div>

            <div className="bg-[#0D0D12] rounded-lg p-4">
              <p className="text-white italic">"{lastRound.message}"</p>
            </div>

            <div className="mt-4 p-3 bg-[#3B82F6]/10 rounded-lg border border-[#3B82F6]/30">
              <p className="text-sm text-[#9CA3AF] mb-1">Current Offer</p>
              <p className="text-xl font-bold text-[#3B82F6]">
                ${lastRound.investorOffer.amount.toLocaleString()} for {lastRound.investorOffer.equity}%
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                Valuation: ${Math.round(lastRound.investorOffer.amount / (lastRound.investorOffer.equity / 100)).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Your response */}
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Your Response</h4>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Investment Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="number"
                    value={counterOffer.amount}
                    onChange={(e) => setCounterOffer(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-10 pr-4 py-3 bg-[#0D0D12] border border-[#2E2E3E] rounded-lg text-white focus:border-[#3B82F6] focus:outline-none"
                    step={10000}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Equity %</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="number"
                    value={counterOffer.equity}
                    onChange={(e) => setCounterOffer(prev => ({ ...prev, equity: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-10 pr-4 py-3 bg-[#0D0D12] border border-[#2E2E3E] rounded-lg text-white focus:border-[#3B82F6] focus:outline-none"
                    min={1}
                    max={100}
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#0D0D12] rounded-lg mb-6">
              <p className="text-sm text-[#9CA3AF]">Your Implied Valuation</p>
              <p className="text-xl font-bold text-white">
                ${counterOffer.equity > 0 ? Math.round(counterOffer.amount / (counterOffer.equity / 100)).toLocaleString() : 0}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={acceptOffer}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#22C55E] text-white font-semibold rounded-xl hover:bg-[#16A34A] transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Accept Offer
              </button>
              <button
                onClick={submitCounter}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#3B82F6] text-white font-semibold rounded-xl hover:bg-[#2563EB] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
                Counter
              </button>
              <button
                onClick={walkAway}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#EF4444] text-white font-semibold rounded-xl hover:bg-[#DC2626] transition-colors"
              >
                <XCircle className="w-5 h-5" />
                Walk Away
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Finished screen
  return (
    <div className="min-h-screen bg-[#0D0D12] pt-14">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/games')}
          className="flex items-center gap-2 text-[#9CA3AF] hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenges</span>
        </button>

        <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8 text-center">
          {finalDeal ? (
            <>
              <div className="w-20 h-20 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-[#22C55E]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Deal Closed!</h2>
              <p className="text-[#9CA3AF] mb-6">
                You secured ${finalDeal.amount.toLocaleString()} for {finalDeal.equity}% equity
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-[#0D0D12] rounded-xl">
                  <p className="text-3xl font-bold text-[#F5C518]">{score}</p>
                  <p className="text-sm text-[#6B7280]">Points Earned</p>
                </div>
                <div className="p-4 bg-[#0D0D12] rounded-xl">
                  <p className="text-3xl font-bold text-[#22C55E]">{dealsCompleted}</p>
                  <p className="text-sm text-[#6B7280]">Deals Made</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-[#EF4444]/20 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-[#EF4444]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Deal</h2>
              <p className="text-[#9CA3AF] mb-6">
                Sometimes walking away is the right move. Try again with a different approach!
              </p>
            </>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={playAgain}
              className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-xl hover:bg-[#2563EB] transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              New Pitch
            </button>
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-[#2E2E3E] text-white font-semibold rounded-xl hover:bg-[#3E3E4E] transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealNegotiator;
