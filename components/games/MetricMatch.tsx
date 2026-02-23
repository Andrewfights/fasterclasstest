import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, TrendingUp, RotateCcw, Zap } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';

interface Metric {
  id: string;
  name: string;
  abbreviation?: string;
  description: string;
  exampleValues: string[];
  category: 'growth' | 'financial' | 'engagement' | 'acquisition';
}

interface Question {
  value: string;
  correctMetric: Metric;
  options: Metric[];
}

type GameState = 'ready' | 'playing' | 'finished';

const GAME_DURATION = 60;
const POINTS_CORRECT = 100;
const POINTS_STREAK_BONUS = 25;
const XP_PER_CORRECT = 5;

// Startup metrics data
const METRICS: Metric[] = [
  {
    id: 'mrr',
    name: 'Monthly Recurring Revenue',
    abbreviation: 'MRR',
    description: 'Predictable revenue generated each month from subscriptions',
    exampleValues: ['$50K/mo', '$120K MRR', '$15K monthly', '$500K/month recurring'],
    category: 'financial',
  },
  {
    id: 'arr',
    name: 'Annual Recurring Revenue',
    abbreviation: 'ARR',
    description: 'Yearly predictable revenue from subscriptions',
    exampleValues: ['$1.2M ARR', '$600K annually', '$2.4M/year recurring', '$5M ARR'],
    category: 'financial',
  },
  {
    id: 'churn',
    name: 'Churn Rate',
    description: 'Percentage of customers who cancel in a period',
    exampleValues: ['3% monthly churn', '5% customer loss', '2.5% cancellation rate', '8% monthly attrition'],
    category: 'engagement',
  },
  {
    id: 'cac',
    name: 'Customer Acquisition Cost',
    abbreviation: 'CAC',
    description: 'Average cost to acquire one new customer',
    exampleValues: ['$150 CAC', '$75 per acquisition', '$200 to acquire', '$50 cost per customer'],
    category: 'acquisition',
  },
  {
    id: 'ltv',
    name: 'Lifetime Value',
    abbreviation: 'LTV',
    description: 'Total revenue expected from a customer over time',
    exampleValues: ['$2,400 LTV', '$1,800 lifetime', '$3,600 customer value', '$900 LTV'],
    category: 'financial',
  },
  {
    id: 'conversion',
    name: 'Conversion Rate',
    description: 'Percentage of visitors who become customers',
    exampleValues: ['4.5% conversion', '2.8% visitor-to-signup', '6% trial conversion', '3.2% sign-up rate'],
    category: 'acquisition',
  },
  {
    id: 'nps',
    name: 'Net Promoter Score',
    abbreviation: 'NPS',
    description: 'Customer satisfaction and loyalty metric (-100 to 100)',
    exampleValues: ['+45 NPS', 'NPS of 72', '+38 promoter score', 'Net score: 55'],
    category: 'engagement',
  },
  {
    id: 'dau',
    name: 'Daily Active Users',
    abbreviation: 'DAU',
    description: 'Number of unique users engaging daily',
    exampleValues: ['15K DAU', '45,000 daily actives', '8K users/day', '120K daily users'],
    category: 'engagement',
  },
  {
    id: 'mau',
    name: 'Monthly Active Users',
    abbreviation: 'MAU',
    description: 'Number of unique users engaging monthly',
    exampleValues: ['250K MAU', '1.2M monthly users', '85K monthly actives', '500K MAU'],
    category: 'engagement',
  },
  {
    id: 'burn',
    name: 'Burn Rate',
    description: 'Monthly cash spending rate',
    exampleValues: ['$80K/mo burn', '$150K monthly spend', 'Burning $200K/mo', '$45K monthly burn'],
    category: 'financial',
  },
  {
    id: 'runway',
    name: 'Runway',
    description: 'Months of operation possible with current cash',
    exampleValues: ['18 months runway', '24 months left', '12 mo runway', '8 months of cash'],
    category: 'financial',
  },
  {
    id: 'gmv',
    name: 'Gross Merchandise Value',
    abbreviation: 'GMV',
    description: 'Total value of goods sold through marketplace',
    exampleValues: ['$2M GMV', '$500K monthly GMV', '$5M merchandise sold', '$1.2M transaction volume'],
    category: 'financial',
  },
  {
    id: 'retention',
    name: 'Retention Rate',
    description: 'Percentage of users who return over time',
    exampleValues: ['85% 30-day retention', '92% retention', '78% user retention', '88% monthly retention'],
    category: 'engagement',
  },
  {
    id: 'arpu',
    name: 'Average Revenue Per User',
    abbreviation: 'ARPU',
    description: 'Average revenue generated per user',
    exampleValues: ['$45 ARPU', '$120/user/mo', '$28 per user', '$65 avg revenue/user'],
    category: 'financial',
  },
  {
    id: 'growth-rate',
    name: 'Month-over-Month Growth',
    abbreviation: 'MoM',
    description: 'Percentage growth compared to previous month',
    exampleValues: ['15% MoM growth', '22% monthly growth', '8% month-over-month', '35% MoM'],
    category: 'growth',
  },
  {
    id: 'viral-coeff',
    name: 'Viral Coefficient',
    abbreviation: 'K-factor',
    description: 'Number of new users each existing user brings',
    exampleValues: ['K-factor: 1.3', '0.8 viral coefficient', 'K = 1.5', 'Virality: 1.1'],
    category: 'growth',
  },
];

// Shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate a question
const generateQuestion = (usedIds: Set<string>): Question | null => {
  const availableMetrics = METRICS.filter(m => !usedIds.has(m.id));
  if (availableMetrics.length === 0) return null;

  const correctMetric = availableMetrics[Math.floor(Math.random() * availableMetrics.length)];
  const value = correctMetric.exampleValues[Math.floor(Math.random() * correctMetric.exampleValues.length)];

  // Get 3 wrong options from same or similar categories
  const wrongOptions = shuffleArray(
    METRICS.filter(m => m.id !== correctMetric.id)
  ).slice(0, 3);

  const options = shuffleArray([correctMetric, ...wrongOptions]);

  return {
    value,
    correctMetric,
    options,
  };
};

export const MetricMatch: React.FC = () => {
  const navigate = useNavigate();
  const { addXP } = useGamification();

  const [gameState, setGameState] = useState<GameState>('ready');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);

  // Generate next question
  const generateNextQuestion = useCallback(() => {
    const question = generateQuestion(usedIds);
    if (question) {
      setUsedIds(prev => new Set([...prev, question.correctMetric.id]));
      setCurrentQuestion(question);
    } else {
      // All metrics used, reset
      setUsedIds(new Set());
      const newQuestion = generateQuestion(new Set());
      if (newQuestion) {
        setUsedIds(new Set([newQuestion.correctMetric.id]));
        setCurrentQuestion(newQuestion);
      }
    }
    setSelectedAnswer(null);
    setAnswerResult(null);
  }, [usedIds]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrect(0);
    setWrong(0);
    setUsedIds(new Set());
    const question = generateQuestion(new Set());
    if (question) {
      setUsedIds(new Set([question.correctMetric.id]));
      setCurrentQuestion(question);
    }
    setSelectedAnswer(null);
    setAnswerResult(null);
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Handle answer
  const handleAnswer = useCallback((metricId: string) => {
    if (selectedAnswer || !currentQuestion || gameState !== 'playing') return;

    setSelectedAnswer(metricId);
    const isCorrect = metricId === currentQuestion.correctMetric.id;

    if (isCorrect) {
      setAnswerResult('correct');
      const streakBonus = streak >= 3 ? POINTS_STREAK_BONUS * Math.min(streak - 2, 5) : 0;
      setScore(prev => prev + POINTS_CORRECT + streakBonus);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setCorrect(prev => prev + 1);
    } else {
      setAnswerResult('wrong');
      setStreak(0);
      setWrong(prev => prev + 1);
    }

    setTimeout(() => {
      generateNextQuestion();
    }, 800);
  }, [selectedAnswer, currentQuestion, gameState, streak, generateNextQuestion]);

  // Award XP on finish
  useEffect(() => {
    if (gameState === 'finished' && correct > 0) {
      const totalXP = correct * XP_PER_CORRECT;
      addXP(totalXP);
    }
  }, [gameState, correct, addXP]);

  // Category colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return '#22C55E';
      case 'growth': return '#8B5CF6';
      case 'engagement': return '#3B82F6';
      case 'acquisition': return '#F5C518';
      default: return '#9CA3AF';
    }
  };

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </button>

          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-[#22C55E]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Metric Match</h1>
            <p className="text-[#9CA3AF] mb-6 max-w-md mx-auto">
              Identify which startup metric matches the given value.
              Learn MRR, CAC, LTV, and more!
            </p>

            <div className="flex justify-center gap-8 mb-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-[#22C55E]">+{POINTS_CORRECT}</p>
                <p className="text-[#6B7280]">per correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F5C518]">+{POINTS_STREAK_BONUS}</p>
                <p className="text-[#6B7280]">streak bonus</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8B5CF6]">+{XP_PER_CORRECT} XP</p>
                <p className="text-[#6B7280]">per correct</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-4 bg-[#22C55E] text-white font-bold text-lg rounded-xl hover:bg-[#16A34A] transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen
  if (gameState === 'playing' && currentQuestion) {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quit
            </button>

            <div className="flex items-center gap-6">
              {streak >= 3 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-[#F5C518]/20 rounded-full">
                  <Zap className="w-4 h-4 text-[#F5C518]" />
                  <span className="text-[#F5C518] font-bold">{streak}x</span>
                </div>
              )}

              <div className="text-right">
                <p className="text-2xl font-bold text-white">{score.toLocaleString()}</p>
                <p className="text-xs text-[#6B7280]">points</p>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                timeLeft <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-[#1A1A24] text-white'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="text-xl font-bold font-mono">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-1 text-sm">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              <span className="text-[#22C55E] font-medium">{correct}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium">{wrong}</span>
            </div>
          </div>

          {/* Question */}
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] overflow-hidden">
            {/* Value Display */}
            <div className="p-8 bg-[#22C55E]/10 border-b border-[#2E2E3E] text-center">
              <p className="text-sm text-[#22C55E] font-medium mb-2">What metric is this?</p>
              <h2 className="text-4xl font-bold text-white">{currentQuestion.value}</h2>
            </div>

            {/* Options */}
            <div className="p-4 space-y-3">
              {currentQuestion.options.map((metric) => {
                const isSelected = selectedAnswer === metric.id;
                const isCorrect = metric.id === currentQuestion.correctMetric.id;
                const showResult = selectedAnswer !== null;

                let bgClass = 'bg-[#0D0D12] hover:bg-[#2E2E3E] border-[#2E2E3E]';
                let textClass = 'text-white';

                if (showResult) {
                  if (isCorrect) {
                    bgClass = 'bg-[#22C55E]/20 border-[#22C55E]';
                    textClass = 'text-[#22C55E]';
                  } else if (isSelected && !isCorrect) {
                    bgClass = 'bg-red-500/20 border-red-500';
                    textClass = 'text-red-400';
                  } else {
                    bgClass = 'bg-[#0D0D12] border-[#2E2E3E] opacity-50';
                    textClass = 'text-[#6B7280]';
                  }
                }

                return (
                  <button
                    key={metric.id}
                    onClick={() => handleAnswer(metric.id)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl border transition-all text-left ${bgClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        showResult && isCorrect ? 'bg-[#22C55E]' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500' :
                        'bg-[#2E2E3E]'
                      }`}>
                        {showResult && isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : showResult && isSelected && !isCorrect ? (
                          <XCircle className="w-5 h-5 text-white" />
                        ) : (
                          <TrendingUp className="w-5 h-5" style={{ color: getCategoryColor(metric.category) }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${textClass}`}>
                          {metric.name}
                          {metric.abbreviation && (
                            <span className="text-[#6B7280] font-normal ml-2">({metric.abbreviation})</span>
                          )}
                        </p>
                        <p className="text-sm text-[#6B7280] mt-1">{metric.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    const xpEarned = correct * XP_PER_CORRECT;

    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#F5C518]/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-[#F5C518]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Time's Up!</h1>
            <p className="text-[#9CA3AF] mb-8">Here's how you did</p>

            <div className="mb-8">
              <p className="text-6xl font-bold text-[#22C55E]">{score.toLocaleString()}</p>
              <p className="text-[#9CA3AF]">points</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-[#22C55E]">{correct}</p>
                <p className="text-xs text-[#6B7280]">Correct</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-red-400">{wrong}</p>
                <p className="text-xs text-[#6B7280]">Wrong</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-white">{accuracy}%</p>
                <p className="text-xs text-[#6B7280]">Accuracy</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-[#F5C518]">{maxStreak}x</p>
                <p className="text-xs text-[#6B7280]">Best Streak</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/20 rounded-full mb-8">
              <Zap className="w-5 h-5 text-[#8B5CF6]" />
              <span className="text-[#8B5CF6] font-bold">+{xpEarned} XP earned!</span>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/games')}
                className="px-6 py-3 bg-[#2E2E3E] text-white font-semibold rounded-xl hover:bg-[#3E3E4E] transition-colors"
              >
                Back to Games
              </button>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 bg-[#22C55E] text-white font-semibold rounded-xl hover:bg-[#16A34A] transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MetricMatch;
