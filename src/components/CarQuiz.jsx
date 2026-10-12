import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/carSystems.js';
import confetti from 'canvas-confetti';

export default function CarQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];
  const userChoice = selectedAnswers[currentIdx];

  const handleSelect = (optionIdx) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // already answered
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIdx]: optionIdx
    });
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen !== undefined && q.options[chosen]?.isCorrect) {
        score++;
      }
    });
    return score;
  };

  const handleFinish = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score >= 4) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const isAllAnswered = totalAnswered === QUIZ_QUESTIONS.length;

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Car Engineering Knowledge Quiz</h3>
          </div>
          <p className="text-sm text-slate-400">
            Test your understanding of mechanical advantage, Otto cycles, differentials, and thermodynamics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isSubmitted ? (
        <div className="space-y-6">
          {/* Question title */}
          <div>
            <h4 className="text-base font-semibold text-white mb-2 leading-relaxed">
              {question.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, optIdx) => {
              const isSelected = userChoice === optIdx;
              const hasAnswered = userChoice !== undefined;
              let btnStyle = 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 text-slate-200';

              if (hasAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-red-950/40 border-red-500/80 text-red-200 ring-1 ring-red-500';
                } else {
                  btnStyle = 'bg-slate-950/30 border-slate-800/50 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={hasAnswered}
                  onClick={() => handleSelect(optIdx)}
                  className={`w-full p-4 rounded-xl text-left border transition text-sm flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <span className="leading-relaxed">{opt.text}</span>
                  {hasAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {hasAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation reveal once answered */}
          {userChoice !== undefined && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 animate-fadeIn">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Engineering Explanation:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Navigation & Progress */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex gap-1.5">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition ${
                    currentIdx === idx
                      ? 'bg-amber-600 text-white'
                      : selectedAnswers[idx] !== undefined
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-slate-800/50 text-slate-500 hover:bg-slate-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={!isAllAnswered}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                    isAllAnswered
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  View Final Score
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Results screen */
        <div className="text-center py-8 space-y-4 max-w-md mx-auto">
          <div className="inline-flex p-4 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-2">
            <Award className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-bold text-white">Quiz Completed!</h4>
          <p className="text-sm text-slate-400">
            You scored <span className="text-amber-400 font-bold text-lg">{calculateScore()}</span> out of {QUIZ_QUESTIONS.length}
          </p>

          <p className="text-xs text-slate-300 p-4 rounded-xl bg-slate-950/80 border border-slate-800 leading-relaxed">
            {calculateScore() === 5
              ? 'Outstanding! You have mastered vehicle engineering principles, from the Otto cycle to Ackermann kinematics.'
              : calculateScore() >= 3
              ? 'Great job! You have a solid grasp of how car mechanical systems coordinate.'
              : 'Keep exploring! Check the interactive simulators above to master gear leverage and thermodynamics.'}
          </p>

          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20 transition"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
