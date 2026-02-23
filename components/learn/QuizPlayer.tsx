import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw, Zap, Clock, Eye, ChevronLeft } from 'lucide-react';
import { INITIAL_QUIZZES } from '../../data/quizzes';
import { COURSES } from '../../constants';
import { useGamification } from '../../contexts/GamificationContext';
import { Quiz, QuizQuestion } from '../../types';

type QuizState = 'playing' | 'reviewing' | 'complete';

export const QuizPlayer: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const { progress, recordQuizAttempt, addXP } = useGamification();

  const [quizState, setQuizState] = useState<QuizState>('playing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (quizState === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizState, startTime]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const quiz = INITIAL_QUIZZES.find(q => q.id === quizId);
  const course = quiz ? COURSES.find(c => c.id === quiz.courseId) : null;
  const currentQuestion = quiz?.questions[currentIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!quiz || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Challenge not found</h2>
          <button
            onClick={() => navigate('/learn/quizzes')}
            className="px-4 py-2 bg-[#8B5CF6] text-white rounded-xl"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);

    // Store answer
    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Calculate results
      const finalAnswers = [...answers];
      finalAnswers[currentIndex] = selectedAnswer!;

      const correctCount = finalAnswers.filter(
        (ans, i) => ans === quiz.questions[i].correctIndex
      ).length;

      const score = Math.round((correctCount / quiz.questions.length) * 100);
      const passed = score >= quiz.passingScore;
      const xpEarned = passed
        ? quiz.xpReward + quiz.questions.filter(
            (q, i) => finalAnswers[i] === q.correctIndex
          ).reduce((sum, q) => sum + q.xpValue, 0)
        : quiz.questions.filter(
            (q, i) => finalAnswers[i] === q.correctIndex
          ).reduce((sum, q) => sum + q.xpValue, 0);

      // Record attempt
      recordQuizAttempt({
        quizId: quiz.id,
        moduleId: quiz.courseId,
        score,
        passed,
        answers: finalAnswers.reduce((acc, ans, i) => {
          acc[quiz.questions[i].id] = String(ans);
          return acc;
        }, {} as Record<string, string>),
        attemptedAt: Date.now(),
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        xpEarned,
      }, quiz.courseId);

      setQuizState('complete');
    }
  };

  const restartQuiz = () => {
    setQuizState('playing');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
  };

  // Get incorrect answers for review
  const incorrectQuestions = quiz.questions
    .map((q, i) => ({ question: q, index: i, userAnswer: answers[i] }))
    .filter(item => item.userAnswer !== item.question.correctIndex);

  // Review Screen - show incorrect answers
  if (quizState === 'reviewing') {
    const currentReview = incorrectQuestions[reviewIndex];
    if (!currentReview) {
      setQuizState('complete');
      return null;
    }

    const question = currentReview.question;

    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setQuizState('complete')}
              className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Results
            </button>
            <div className="text-center">
              <p className="text-sm font-medium text-white">Reviewing Incorrect</p>
              <p className="text-xs text-[#6B7280]">
                {reviewIndex + 1} of {incorrectQuestions.length}
              </p>
            </div>
            <div className="w-16" />
          </div>

          {/* Progress */}
          <div className="h-1 bg-[#2E2E3E] rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-[#F59E0B] transition-all"
              style={{ width: `${((reviewIndex + 1) / incorrectQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] overflow-hidden mb-6">
            <div className="p-6 border-b border-[#2E2E3E]">
              <p className="text-lg text-white leading-relaxed">{question.question}</p>
            </div>

            {/* Options showing user answer vs correct */}
            <div className="p-4 space-y-3">
              {question.options.map((option, index) => {
                const isCorrect = index === question.correctIndex;
                const isUserAnswer = index === currentReview.userAnswer;

                let bgClass = 'bg-[#0D0D12] border-[#2E2E3E] opacity-50';
                let textClass = 'text-[#6B7280]';

                if (isCorrect) {
                  bgClass = 'bg-[#22C55E]/20 border-[#22C55E]';
                  textClass = 'text-[#22C55E]';
                } else if (isUserAnswer) {
                  bgClass = 'bg-red-500/20 border-red-500';
                  textClass = 'text-red-400';
                }

                return (
                  <div
                    key={index}
                    className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${bgClass}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isCorrect ? 'bg-[#22C55E] text-white' :
                      isUserAnswer ? 'bg-red-500 text-white' :
                      'bg-[#2E2E3E] text-[#9CA3AF]'
                    }`}>
                      {isCorrect ? <CheckCircle className="w-4 h-4" /> :
                       isUserAnswer ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + index)}
                    </span>
                    <span className={textClass}>{option}</span>
                    {isUserAnswer && !isCorrect && (
                      <span className="ml-auto text-xs text-red-400">Your answer</span>
                    )}
                    {isCorrect && (
                      <span className="ml-auto text-xs text-[#22C55E]">Correct</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 mb-6">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#F59E0B] mb-1">Explanation</p>
                <p className="text-sm text-[#9CA3AF]">{question.explanation}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setReviewIndex(prev => Math.max(0, prev - 1))}
              disabled={reviewIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-[#9CA3AF] hover:text-white transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <button
              onClick={() => {
                if (reviewIndex < incorrectQuestions.length - 1) {
                  setReviewIndex(prev => prev + 1);
                } else {
                  setQuizState('complete');
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-white font-semibold rounded-xl hover:bg-[#D97706] transition-colors"
            >
              {reviewIndex < incorrectQuestions.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                'Done Reviewing'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (quizState === 'complete') {
    const correctCount = answers.filter(
      (ans, i) => ans === quiz.questions[i].correctIndex
    ).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    const xpEarned = passed
      ? quiz.xpReward + quiz.questions.filter(
          (q, i) => answers[i] === q.correctIndex
        ).reduce((sum, q) => sum + q.xpValue, 0)
      : quiz.questions.filter(
          (q, i) => answers[i] === q.correctIndex
        ).reduce((sum, q) => sum + q.xpValue, 0);
    const timeSpent = formatTime(elapsedTime);

    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8 text-center">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
              passed ? 'bg-[#22C55E]/20' : 'bg-[#F59E0B]/20'
            }`}>
              {passed ? (
                <Trophy className="w-10 h-10 text-[#22C55E]" />
              ) : (
                <XCircle className="w-10 h-10 text-[#F59E0B]" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {passed ? 'You Crushed It!' : 'Almost There'}
            </h1>
            <p className="text-[#9CA3AF] mb-8">
              {passed
                ? 'Great job! You\'ve locked this in.'
                : `You need ${quiz.passingScore}% to pass. Run it back!`}
            </p>

            <div className="grid grid-cols-5 gap-3 mb-8">
              <div className="p-3 bg-[#0D0D12] rounded-xl">
                <p className="text-xl font-bold text-[#22C55E]">{correctCount}</p>
                <p className="text-xs text-[#6B7280]">Correct</p>
              </div>
              <div className="p-3 bg-[#0D0D12] rounded-xl">
                <p className="text-xl font-bold text-red-400">{quiz.questions.length - correctCount}</p>
                <p className="text-xs text-[#6B7280]">Wrong</p>
              </div>
              <div className="p-3 bg-[#0D0D12] rounded-xl">
                <p className={`text-xl font-bold ${passed ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                  {score}%
                </p>
                <p className="text-xs text-[#6B7280]">Score</p>
              </div>
              <div className="p-3 bg-[#0D0D12] rounded-xl">
                <p className="text-xl font-bold text-[#3B82F6]">{timeSpent}</p>
                <p className="text-xs text-[#6B7280]">Time</p>
              </div>
              <div className="p-3 bg-[#0D0D12] rounded-xl">
                <p className={`text-xl font-bold ${passed ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                  {passed ? 'Pass' : 'Fail'}
                </p>
                <p className="text-xs text-[#6B7280]">Result</p>
              </div>
            </div>

            {xpEarned > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/20 rounded-full mb-8">
                <Zap className="w-5 h-5 text-[#8B5CF6]" />
                <span className="text-[#8B5CF6] font-bold">+{xpEarned} HP earned!</span>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/learn/quizzes')}
                className="px-5 py-3 bg-[#2E2E3E] text-white font-semibold rounded-xl hover:bg-[#3E3E4E] transition-colors"
              >
                All Challenges
              </button>
              {incorrectQuestions.length > 0 && (
                <button
                  onClick={() => {
                    setReviewIndex(0);
                    setQuizState('reviewing');
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-[#F59E0B] text-white font-semibold rounded-xl hover:bg-[#D97706] transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Review Incorrect ({incorrectQuestions.length})
                </button>
              )}
              <button
                onClick={restartQuiz}
                className="flex items-center gap-2 px-5 py-3 bg-[#22C55E] text-white font-semibold rounded-xl hover:bg-[#16A34A] transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Run It Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-[#0D0D12] pt-14">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/learn/quizzes')}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quit
          </button>
          <div className="text-center">
            <p className="text-sm font-medium text-white">{quiz.title}</p>
            <p className="text-xs text-[#6B7280]">
              Question {currentIndex + 1} of {quiz.questions.length}
            </p>
          </div>
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A24] rounded-lg">
            <Clock className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-sm font-mono text-white">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-1 bg-[#2E2E3E] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-[#22C55E] transition-all"
            style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] overflow-hidden mb-6">
          <div className="p-6 border-b border-[#2E2E3E]">
            <p className="text-lg text-white leading-relaxed">{currentQuestion.question}</p>
          </div>

          {/* Options */}
          <div className="p-4 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctIndex;
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
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${bgClass}`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    showResult && isCorrect ? 'bg-[#22C55E] text-white' :
                    showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                    'bg-[#2E2E3E] text-[#9CA3AF]'
                  }`}>
                    {showResult && isCorrect ? <CheckCircle className="w-4 h-4" /> :
                     showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                     String.fromCharCode(65 + index)}
                  </span>
                  <span className={`${textClass}`}>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-4 rounded-xl mb-6 ${
            selectedAnswer === currentQuestion.correctIndex
              ? 'bg-[#22C55E]/10 border border-[#22C55E]/30'
              : 'bg-[#F59E0B]/10 border border-[#F59E0B]/30'
          }`}>
            <div className="flex items-start gap-3">
              {selectedAnswer === currentQuestion.correctIndex ? (
                <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium mb-1 ${
                  selectedAnswer === currentQuestion.correctIndex
                    ? 'text-[#22C55E]'
                    : 'text-[#F59E0B]'
                }`}>
                  {selectedAnswer === currentQuestion.correctIndex ? 'Correct!' : 'Not quite...'}
                </p>
                <p className="text-sm text-[#9CA3AF]">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        {showExplanation && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-[#22C55E] text-white font-bold rounded-xl hover:bg-[#16A34A] transition-colors flex items-center justify-center gap-2"
          >
            {currentIndex < quiz.questions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'See Results'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;
