"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
}

interface QuizSectionProps {
  title: string;
  questions: QuizQuestion[];
}

export function QuizSection({ title, questions }: QuizSectionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Fonction pour détecter si un texte contient des caractères arabes
  const containsArabic = (text: string) => {
    // Plage Unicode pour les caractères arabes
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/;
    return arabicPattern.test(text);
  };

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    const answeredQuestions = Object.keys(selectedAnswers).length;
    if (answeredQuestions < questions.length) {
      return; // Don't submit if not all questions are answered
    }

    const correctAnswers = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctOptionId
    ).length;

    setScore(correctAnswers);
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(null);
  };

  const isAnswerCorrect = (questionId: string, optionId: string) => {
    if (!showResults) return false;
    const question = questions.find((q) => q.id === questionId);
    return question?.correctOptionId === optionId;
  };

  const isAnswerIncorrect = (questionId: string, optionId: string) => {
    if (!showResults) return false;
    return selectedAnswers[questionId] === optionId && !isAnswerCorrect(questionId, optionId);
  };

  const allQuestionsAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="mt-8 space-y-6 border rounded-lg p-6 bg-card">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground">
          Testez vos connaissances avec ce quiz de {questions.length} questions.
        </p>
      </div>

      {score !== null && (
        <div className={cn(
          "p-4 rounded-md mb-4",
          score === questions.length 
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
        )}>
          <p className="font-medium">
            Votre score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          {score === questions.length ? (
            <p>Félicitations ! Vous avez répondu correctement à toutes les questions.</p>
          ) : (
            <p>Continuez à apprendre et réessayez pour améliorer votre score.</p>
          )}
        </div>
      )}

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-4">
            <h4 className={cn(
              "font-medium",
              containsArabic(question.question) && "arabic-text-lg"
            )}>
              Question {index + 1}: {question.question}
            </h4>
            <RadioGroup
              value={selectedAnswers[question.id]}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              disabled={showResults}
            >
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <div className="relative flex items-center">
                      <RadioGroupItem
                        value={option.id}
                        id={`${question.id}-${option.id}`}
                        className={cn(
                          isAnswerCorrect(question.id, option.id) && "border-green-500 text-green-500",
                          isAnswerIncorrect(question.id, option.id) && "border-red-500 text-red-500"
                        )}
                      />
                      {showResults && isAnswerCorrect(question.id, option.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500 absolute -right-6" />
                      )}
                      {showResults && isAnswerIncorrect(question.id, option.id) && (
                        <XCircle className="h-4 w-4 text-red-500 absolute -right-6" />
                      )}
                    </div>
                    <Label
                      htmlFor={`${question.id}-${option.id}`}
                      className={cn(
                        "text-base",
                        isAnswerCorrect(question.id, option.id) && "text-green-700 dark:text-green-500 font-medium",
                        isAnswerIncorrect(question.id, option.id) && "text-red-700 dark:text-red-500 font-medium",
                        containsArabic(option.text) && "arabic-text"
                      )}
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {showResults ? (
          <Button onClick={handleReset}>Réessayer</Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={!allQuestionsAnswered}
          >
            Vérifier mes réponses
          </Button>
        )}
      </div>
    </div>
  );
}