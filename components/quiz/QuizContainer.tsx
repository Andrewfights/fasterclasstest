import React, { useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Zap } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { INITIAL_QUIZZES, LEARNING_MODULES } from '../../constants';
import { QuizQuestion as QuizQuestionType, QuizAttempt } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressRing';
import { CelebrationOverlay } from '../ui/Confetti';

export const QuizContainer: React.FC = () => {
  const { moduleId, quizId } = useParams<{ moduleId: string; quizId: string }>();
  const navigate = useNavigate();
  const { recordQuizAttempt, earnXP, checkAchievements } = useGamification();

  const module = LEARNING_MODULES.find((m) => m.id === moduleId);
  const quiz = INITIAL_QUIZZES.find((q) => q.id === quizId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  if (!module || !quiz) {
    return <Navigate to="/" replace />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + (showExplanation ? 1 : 0)) / totalQuestions) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    setAnswers([...answers, selectedAnswer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
    } else {
      // Quiz complete
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const finalAnswers = [...answers, selectedAnswer as number];
    const correctCount = finalAnswers.filter(
      (answer, index) => answer === quiz.questions[index].correctIndex
    ).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    const xpEarned = passed
      ? quiz.xpReward + quiz.questions.filter(
          (q, i) => finalAnswers[i] === q.correctIndex
        ).reduce((sum, q) => sum + q.xpValue, 0)
      : quiz.questions.filter(
          (q, i) => finalAnswers[i] === q.correctIndex
        ).reduce((sum, q) => sum + q.xpValue, 0);

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: quiz.id,
      answers: finalAnswers,
      score,
      xpEarned,
      completedAt: Date.now(),
      passed,
    };

    recordQuizAttempt(attempt, module.id);
    checkAchievements();
    setQuizComplete(true);

    if (passed) {
      setShowCelebration(true);
    }
  };

  if (quizComplete) {
    const finalAnswers = answers;
    const correctCount = finalAnswers.filter(
      (answer, index) => answer === quiz.questions[index].correctIndex
    ).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;
    const xpEarned = passed
      ? quiz.xpReward + quiz.questions.filter(
          (q, i) => finalAnswers[i] === q.correctIndex
        ).reduce((sum, q) => sum + q.xpValue, 0)
      : quiz.questions.filter(
          (q, i) => finalAnswers[i] === q.correctIndex
        ).reduce((sum, q) => sum + q.xpValue, 0);

    return (
      <div className="min-h-screen bg-[#F7F7F7] pt-20 pb-32 flex items-center justify-center">
        <CelebrationOverlay
          show={showCelebration}
          title={passed ? 'Quiz Passed!' : 'Keep Learning!'}
          subtitle={`You scored ${score}%`}
          icon={passed ? '🎉' : '📚'}
          xpGained={xpEarned}
          onClose={() => setShowCelebration(false)}
        />

        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className={`
              w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center
              ${passed ? 'bg-[#E8F5E9]' : 'bg-[#FFF3E0]'}
            `}>
              {passed ? (
                <CheckCircle className="w-12 h-12 text-[#58CC02]" />
              ) : (
                <XCircle className="w-12 h-12 text-[#FF9600]" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-[#3C3C3C] mb-2">
              {passed ? 'Congratulations!' : 'Nice Try!'}
            </h1>

            <p className="text-[#777777] mb-6">
              You answered {correctCount} out of {totalQuestions} questions correctly.
            </p>

            <div className="text-5xl font-bold mb-2" style={{ color: passed ? '#58CC02' : '#FF9600' }}>
              {score}%
            </div>

            <div className="flex items-center justify-center gap-2 text-[#FF9600] font-semibold mb-8">
              <Zap className="w-5 h-5" />
              <span>+{xpEarned} XP earned</span>
            </div>

            <div className="space-y-3">
              {passed ? (
                <Link to={`/module/${module.id}`}>
                  <Button variant="primary" fullWidth>
                    Continue Learning
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setAnswers([]);
                      setSelectedAnswer(null);
                      setShowExplanation(false);
                      setIsCorrect(null);
                      setQuizComplete(false);
                    }}
                  >
                    Try Again
                  </Button>
                  <Link to={`/module/${module.id}`}>
                    <Button variant="outline" fullWidth>
                      Back to Module
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20 pb-32">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#777777] hover:text-[#3C3C3C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Exit Quiz</span>
          </button>
          <span className="text-sm text-[#777777]">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <ProgressBar
          progress={progress}
          height={8}
          color={module.color}
          className="mb-8"
        />

        {/* Question card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-[#3C3C3C] mb-6">
            {currentQuestion.question}
          </h2>

          {/* Answer options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              let bgColor = 'bg-white';
              let borderColor = 'border-[#E5E5E5]';
              let textColor = 'text-[#3C3C3C]';

              if (showExplanation) {
                if (index === currentQuestion.correctIndex) {
                  bgColor = 'bg-[#E8F5E9]';
                  borderColor = 'border-[#58CC02]';
                  textColor = 'text-[#2E7D32]';
                } else if (index === selectedAnswer && !isCorrect) {
                  bgColor = 'bg-[#FFEBEE]';
                  borderColor = 'border-[#FF4B4B]';
                  textColor = 'text-[#C62828]';
                }
              } else if (selectedAnswer === index) {
                bgColor = 'bg-[#E3F2FD]';
                borderColor = 'border-[#1CB0F6]';
                textColor = 'text-[#1565C0]';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left font-medium transition-all
                    ${bgColor} ${borderColor} ${textColor}
                    ${!showExplanation && 'hover:border-[#1CB0F6] hover:bg-[#E3F2FD]'}
                    ${showExplanation && 'cursor-default'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${selectedAnswer === index || (showExplanation && index === currentQuestion.correctIndex)
                        ? bgColor === 'bg-[#E8F5E9]' ? 'bg-[#58CC02] text-white' :
                          bgColor === 'bg-[#FFEBEE]' ? 'bg-[#FF4B4B] text-white' :
                          'bg-[#1CB0F6] text-white'
                        : 'bg-[#F7F7F7] text-[#777777]'
                      }
                    `}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                    {showExplanation && index === currentQuestion.correctIndex && (
                      <CheckCircle className="w-5 h-5 ml-auto text-[#58CC02]" />
                    )}
                    {showExplanation && index === selectedAnswer && !isCorrect && (
                      <XCircle className="w-5 h-5 ml-auto text-[#FF4B4B]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`
              p-4 rounded-xl mb-6
              ${isCorrect ? 'bg-[#E8F5E9]' : 'bg-[#FFF3E0]'}
            `}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-[#58CC02]" />
                    <span className="font-bold text-[#2E7D32]">Correct! +{currentQuestion.xpValue} XP</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-[#FF9600]" />
                    <span className="font-bold text-[#E65100]">Not quite right</span>
                  </>
                )}
              </div>
              <p className="text-[#3C3C3C]">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action button */}
          {!showExplanation ? (
            <Button
              variant="primary"
              fullWidth
              size="lg"
              disabled={selectedAnswer === null}
              onClick={handleSubmitAnswer}
              style={{ backgroundColor: module.color }}
            >
              Check Answer
            </Button>
          ) : (
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleNextQuestion}
              style={{ backgroundColor: module.color }}
            >
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
