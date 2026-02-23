import React from 'react';
import { Rocket, DollarSign, TrendingUp, Users, Target, BarChart3, Flame, ChevronRight } from 'lucide-react';
import { FounderJourney, FounderStage } from '../../types';

interface FounderHQProps {
  journey: FounderJourney;
  streak: number;
  onViewDetails?: () => void;
}

const STAGE_CONFIG: Record<FounderStage, { name: string; color: string; bgColor: string }> = {
  idea: { name: 'Idea Stage', color: '#9CA3AF', bgColor: 'bg-gray-500/20' },
  preseed: { name: 'Pre-Seed', color: '#8B5CF6', bgColor: 'bg-purple-500/20' },
  seed: { name: 'Seed', color: '#22C55E', bgColor: 'bg-green-500/20' },
  seriesA: { name: 'Series A', color: '#3B82F6', bgColor: 'bg-blue-500/20' },
  seriesB: { name: 'Series B', color: '#F59E0B', bgColor: 'bg-amber-500/20' },
  scale: { name: 'Scale', color: '#EC4899', bgColor: 'bg-pink-500/20' },
  exit: { name: 'Exit', color: '#c9a227', bgColor: 'bg-[#c9a227]/20' },
};

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

export const FounderHQ: React.FC<FounderHQProps> = ({ journey, streak, onViewDetails }) => {
  const stageConfig = STAGE_CONFIG[journey.stage];

  return (
    <div className="bg-gradient-to-r from-[#13131A] to-[#1A1A24] rounded-2xl border border-[#2E2E3E] overflow-hidden">
      {/* Top row - Company info */}
      <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E3E]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{journey.companyName}</h2>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageConfig.bgColor}`}
                style={{ color: stageConfig.color }}
              >
                {stageConfig.name}
              </span>
            </div>
            <p className="text-sm text-[#6B7280] truncate max-w-xs sm:max-w-md">
              "{journey.companyDescription}"
            </p>
          </div>
        </div>

        {/* Streak badge */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 rounded-full flex-shrink-0">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-400">{streak}-day streak</span>
          </div>
        )}
      </div>

      {/* Bottom row - Metrics */}
      <div className="px-4 sm:px-6 py-3 flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
        {/* Cash */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280]">Cash</p>
            <p className="text-sm sm:text-base font-semibold text-white">{formatCurrency(journey.cashBalance)}</p>
          </div>
        </div>

        <div className="w-px h-8 bg-[#2E2E3E] flex-shrink-0" />

        {/* Valuation */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280]">Valuation</p>
            <p className="text-sm sm:text-base font-semibold text-white">{formatCurrency(journey.valuation)}</p>
          </div>
        </div>

        <div className="w-px h-8 bg-[#2E2E3E] flex-shrink-0" />

        {/* Team */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280]">Team</p>
            <p className="text-sm sm:text-base font-semibold text-white">{journey.teamSize}</p>
          </div>
        </div>

        <div className="w-px h-8 bg-[#2E2E3E] flex-shrink-0 hidden sm:block" />

        {/* Product Score */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#c9a227]/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#c9a227]" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280]">Product</p>
            <p className="text-sm sm:text-base font-semibold text-white">{journey.productScore}/100</p>
          </div>
        </div>

        <div className="w-px h-8 bg-[#2E2E3E] flex-shrink-0 hidden md:block" />

        {/* MRR */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280]">MRR</p>
            <p className="text-sm sm:text-base font-semibold text-white">{formatCurrency(journey.mrr)}</p>
          </div>
        </div>

        {/* View details button */}
        {onViewDetails && (
          <>
            <div className="flex-1" />
            <button
              onClick={onViewDetails}
              className="flex items-center gap-1 text-sm text-[#c9a227] hover:text-[#d4af37] transition-colors flex-shrink-0"
            >
              Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FounderHQ;
