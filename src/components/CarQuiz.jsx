import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/carSystems.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import confetti from 'canvas-confetti';

export default function CarQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];
  const userChoice = selectedAnswers[currentIdx];

  const handleSelect = (optionIdx) => {
    if (selectedAnswers[currentIdx] !== undefined) return;
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
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
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
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Car Engineering Knowledge Quiz</CardTitle>
              <Badge variant="secondary" className="hidden sm:inline-flex">Test Skills</Badge>
            </div>
            <CardDescription>Test understanding of mechanical advantage, Otto cycles, differentials, and thermodynamics</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-mono text-slate-400">
            Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <Button size="icon" variant="secondary" onClick={handleReset} title="Reset Quiz">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!isSubmitted ? (
          <div className="space-y-6">
            <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              {question.question}
            </h4>

            <div className="space-y-2.5">
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
                    className={`w-full p-3.5 sm:p-4 rounded-xl text-left border transition text-xs sm:text-sm flex items-start justify-between gap-3 ${btnStyle}`}
                  >
                    <span className="leading-relaxed">{opt.text}</span>
                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isSelected && !opt.isCorrect && (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

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

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex gap-1.5 overflow-x-auto">
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

              <div className="flex gap-2 w-full sm:w-auto">
                {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    className="flex-1 sm:flex-none"
                  >
                    Next Question →
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant={isAllAnswered ? "success" : "secondary"}
                    disabled={!isAllAnswered}
                    onClick={handleFinish}
                    className="flex-1 sm:flex-none"
                  >
                    View Final Score
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 space-y-4 max-w-md mx-auto">
            <div className="inline-flex p-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-2">
              <Award className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white">Quiz Completed!</h4>
            <p className="text-xs sm:text-sm text-slate-400">
              You scored <span className="text-amber-400 font-bold text-base sm:text-lg">{calculateScore()}</span> out of {QUIZ_QUESTIONS.length}
            </p>

            <Button onClick={handleReset} variant="default" className="mt-2">
              Retake Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
