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
    if (score >= 4 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
              <CardTitle>Five questions about how cars work</CardTitle>
              <Badge variant="secondary" className="hidden sm:inline-flex">Review</Badge>
            </div>
            <CardDescription>Choose an answer to see the explanation. You can open the related lesson without losing your place.</CardDescription>
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

            <div className="quiz-options space-y-2.5">
              {question.options.map((opt, optIdx) => {
                const isSelected = userChoice === optIdx;
                const hasAnswered = userChoice !== undefined;
                let btnStyle = 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 text-slate-200';

                if (hasAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = 'quiz-correct';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'quiz-wrong';
                  } else {
                    btnStyle = 'bg-slate-950/30 border-slate-800/50 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={hasAnswered}
                    onClick={() => handleSelect(optIdx)}
                    className={`w-full p-3.5 sm:p-4 rounded-xl text-left border transition-[background-color,color,transform] duration-150 text-xs sm:text-sm flex items-start justify-between gap-3 ${btnStyle}`}
                  >
                    <span className="leading-relaxed">{opt.text}</span>
                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-label="Correct answer" />
                    )}
                    {hasAnswered && isSelected && !opt.isCorrect && (
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5" aria-label="Your answer" />
                    )}
                  </button>
                );
              })}
            </div>

            {userChoice !== undefined && (
              <div role="status" className="quiz-explanation p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {question.options[userChoice].isCorrect ? 'Correct.' : 'Not quite.'} Here is why:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {question.explanation}
                </p>
                <a className="lesson-review-link" href={`#${question.lessonId}`} target="_blank" rel="noopener noreferrer">Review: {question.lessonLabel}<span className="sr-only"> (opens in a new tab)</span></a>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex gap-1.5 overflow-x-auto" role="group" aria-label="Quiz questions">
                {QUIZ_QUESTIONS.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Question ${idx + 1}${selectedAnswers[idx] !== undefined ? ", answered" : ""}`}
                    aria-current={currentIdx === idx ? "step" : undefined}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-[background-color,color,transform] duration-150 ${
                      currentIdx === idx
                        ? 'bg-(--accent) text-(--accent-ink)'
                        : selectedAnswers[idx] !== undefined
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-800/50 text-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {currentIdx === QUIZ_QUESTIONS.length - 1 && !isAllAnswered && <p className="text-slate-300">Answer all five questions to see your score. Use the numbered buttons to return to any you skipped.</p>}
              <div className="flex gap-2 w-full sm:w-auto">
                {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={userChoice === undefined}
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    className="flex-1 sm:flex-none"
                  >
                    Next question →
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant={isAllAnswered ? "success" : "secondary"}
                    disabled={!isAllAnswered}
                    onClick={handleFinish}
                    className="flex-1 sm:flex-none"
                  >
                    See my score
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
            <h4 className="text-xl sm:text-2xl font-bold text-white">You have finished the quiz</h4>
            <p className="text-xs sm:text-sm text-slate-400">
              You scored <span className="text-amber-400 font-bold text-base sm:text-lg">{calculateScore()}</span> out of {QUIZ_QUESTIONS.length}
            </p>

            <div className="quiz-review">
              <h3>Review the lessons</h3>
              {QUIZ_QUESTIONS.map((item, idx) => <a className="lesson-review-link" key={item.id} href={`#${item.lessonId}`} target="_blank" rel="noopener noreferrer">
                <span>{item.lessonLabel}<span className="sr-only"> (opens in a new tab)</span></span><span>{item.options[selectedAnswers[idx]]?.isCorrect ? 'Correct' : 'Review this idea'}</span>
              </a>)}
            </div>
            <Button onClick={handleReset} variant="default" className="mt-2">
              Try again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
