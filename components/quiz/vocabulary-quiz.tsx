"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export interface VocabularyWord {
  french: string;
  arabic: string;
  audio?: string;
}

interface VocabularyQuizProps {
  title: string;
  words: VocabularyWord[];
  direction?: "fr-to-ar" | "ar-to-fr";
}

export function VocabularyQuiz({ title, words, direction = "fr-to-ar" }: VocabularyQuizProps) {
  const [quizMode, setQuizMode] = useState<"writing" | "mcq">("writing");
  const { t } = useTranslation();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {t("QUIZ.TEST_YOUR_KNOWLEDGE")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="writing" onValueChange={(value) => setQuizMode(value as "writing" | "mcq")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="writing">{t("QUIZ.WRITING_MODE")}</TabsTrigger>
            <TabsTrigger value="mcq">{t("QUIZ.MCQ_MODE")}</TabsTrigger>
          </TabsList>
          <TabsContent value="writing">
            <WritingModeQuiz words={words} direction={direction} />
          </TabsContent>
          <TabsContent value="mcq">
            <MCQModeQuiz words={words} direction={direction} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface QuizModeProps {
  words: VocabularyWord[];
  direction: "fr-to-ar" | "ar-to-fr";
}

function AudioButton({ audioUrl, word }: { audioUrl?: string; word: string }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;
    
    const audioElement = new Audio(audioUrl);
    setAudio(audioElement);

    audioElement.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      audioElement.pause();
      audioElement.removeEventListener('ended', () => {
        setIsPlaying(false);
      });
    };
  }, [audioUrl]);

  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-6 w-6 p-0 rounded-full" 
      onClick={togglePlay}
      title={`Écouter la prononciation de "${word}"`}
    >
      <Volume2 className={cn("h-4 w-4", isPlaying ? "text-primary animate-pulse" : "")} />
      <span className="sr-only">Écouter</span>
    </Button>
  );
}

function WritingModeQuiz({ words, direction }: QuizModeProps) {
  const { t } = useTranslation();
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [shuffledWords, setShuffledWords] = useState<VocabularyWord[]>([]);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // Mélanger les mots au chargement du composant
  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [words]);

  const currentWord = shuffledWords[currentWordIndex];

  const handleSubmit = () => {
    if (!currentWord) return;
    
    const correctAnswer = direction === "fr-to-ar" ? currentWord.arabic : currentWord.french;
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);
    setScore(prev => ({
      correct: isAnswerCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const handleNextWord = () => {
    if (currentWordIndex < shuffledWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Mélanger à nouveau les mots si on a fait le tour
      const newShuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(newShuffled);
      setCurrentWordIndex(0);
    }
    
    setUserAnswer("");
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setScore(prev => ({
      ...prev,
      total: prev.total + 1
    }));
  };

  const handleReset = () => {
    const newShuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(newShuffled);
    setCurrentWordIndex(0);
    setUserAnswer("");
    setIsCorrect(null);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  };

  if (!currentWord) {
    return <div>Chargement du vocabulaire...</div>;
  }

  const question = direction === "fr-to-ar" ? currentWord.french : currentWord.arabic;
  const answer = direction === "fr-to-ar" ? currentWord.arabic : currentWord.french;
  const questionLabel = direction === "fr-to-ar" ? "Français" : "Arabe";
  const answerLabel = direction === "fr-to-ar" ? "Arabe" : "Français";
  
  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>{questionLabel}</Label>
        <div className={cn(
          "text-xl font-medium p-3 bg-muted rounded-md",
          direction === "ar-to-fr" && "arabic-text" // Ajouter la classe pour le texte arabe
        )}>
          {question}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="answer">{answerLabel}</Label>
        <div className="flex gap-2">
          <Input
            id="answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={`Entrez la traduction en ${answerLabel.toLowerCase()}`}
            disabled={showAnswer}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !showAnswer) {
                handleSubmit();
              }
            }}
            className={cn(
              isCorrect === true && "border-green-500 focus-visible:ring-green-500",
              isCorrect === false && "border-red-500 focus-visible:ring-red-500",
              direction === "fr-to-ar" && "arabic-text" // Ajouter la classe pour la saisie en arabe
            )}
          />
          {!showAnswer && (
            <Button onClick={handleSubmit} type="submit">
              Vérifier
            </Button>
          )}
        </div>
      </div>
      
      {showAnswer && (
        <div className={cn(
          "p-4 rounded-md",
          isCorrect ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        )}>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <p className="font-medium">
              {isCorrect ? t("QUIZ.CORRECT") : t("QUIZ.INCORRECT")}
            </p>
          </div>
          {!isCorrect && (
            <p className="mt-1 flex items-center gap-2">
              La réponse correcte est: <span className={cn("font-bold", direction === "fr-to-ar" && "arabic-text")}>{answer}</span>
              {direction === "fr-to-ar" && currentWord.audio && (
                <AudioButton audioUrl={currentWord.audio} word={currentWord.arabic} />
              )}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          {t("QUIZ.RESET")}
        </Button>
        
        {showAnswer ? (
          <Button onClick={handleNextWord}>
            {t("QUIZ.NEXT_WORD")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleShowAnswer}>
            {t("QUIZ.SHOW_ANSWER")}
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground mt-2">
        {t("QUIZ.CURRENT_SCORE")}: {score.correct}/{score.total}
      </div>
    </div>
  );
}

function MCQModeQuiz({ words, direction }: QuizModeProps) {
  const { t } = useTranslation();
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [shuffledWords, setShuffledWords] = useState<VocabularyWord[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // Mélanger les mots et générer les options au chargement
  useEffect(() => {
    if (words.length < 4) return; // Besoin d'au moins 4 mots pour les options
    
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    
    // Générer les options pour le premier mot
    generateOptions(shuffled, 0);
  }, [words]);

  // Générer les options pour un mot donné
  const generateOptions = (wordsList: VocabularyWord[], wordIndex: number) => {
    if (!wordsList.length || wordIndex >= wordsList.length) return;
    
    const currentWord = wordsList[wordIndex];
    const correctAnswer = direction === "fr-to-ar" ? currentWord.arabic : currentWord.french;
    
    // Collecter toutes les réponses possibles (sauf la correcte)
    const otherAnswers = wordsList
      .filter((_, idx) => idx !== wordIndex)
      .map(word => direction === "fr-to-ar" ? word.arabic : word.french);
    
    // Sélectionner 3 réponses aléatoires
    const randomAnswers = [...otherAnswers]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Ajouter la réponse correcte et mélanger
    const allOptions = [...randomAnswers, correctAnswer].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentWord) return;
    
    const correctAnswer = direction === "fr-to-ar" ? currentWord.arabic : currentWord.french;
    const isAnswerCorrect = selectedOption === correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);
    setScore(prev => ({
      correct: isAnswerCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const handleNextWord = () => {
    const nextIndex = currentWordIndex < shuffledWords.length - 1 ? currentWordIndex + 1 : 0;
    
    if (nextIndex === 0) {
      // Si on recommence, mélanger à nouveau les mots
      const newShuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(newShuffled);
      generateOptions(newShuffled, 0);
    } else {
      generateOptions(shuffledWords, nextIndex);
    }
    
    setCurrentWordIndex(nextIndex);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handleReset = () => {
    const newShuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(newShuffled);
    setCurrentWordIndex(0);
    generateOptions(newShuffled, 0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  };

  const currentWord = shuffledWords[currentWordIndex];

  if (!currentWord || options.length < 4) {
    return <div>{t("QUIZ.LOADING")}</div>;
  }

  const question = direction === "fr-to-ar" ? currentWord.french : currentWord.arabic;
  const answer = direction === "fr-to-ar" ? currentWord.arabic : currentWord.french;
  const questionLabel = direction === "fr-to-ar" ? "Français" : "Arabe";
  const answerLabel = direction === "fr-to-ar" ? "Arabe" : "Français";
  
  // Déterminer quelle partie a potentiellement un fichier audio
  const audioUrl = direction === "fr-to-ar" ? currentWord.audio : undefined;

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>{questionLabel}</Label>
        <div className={cn(
          "text-xl font-medium p-3 bg-muted rounded-md",
          direction === "ar-to-fr" && "arabic-text" // Ajouter la classe pour le texte arabe
        )}>
          {question}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>{answerLabel}</Label>
        <RadioGroup
          value={selectedOption || ""}
          onValueChange={setSelectedOption}
          disabled={showAnswer}
          className="space-y-3"
        >
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="relative flex items-center">
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  className={cn(
                    showAnswer && option === answer && "border-green-500 text-green-500",
                    showAnswer && selectedOption === option && option !== answer && "border-red-500 text-red-500"
                  )}
                />
                {showAnswer && option === answer && (
                  <CheckCircle className="h-4 w-4 text-green-500 absolute -right-6" />
                )}
                {showAnswer && selectedOption === option && option !== answer && (
                  <XCircle className="h-4 w-4 text-red-500 absolute -right-6" />
                )}
              </div>
              <Label
                htmlFor={`option-${index}`}
                className={cn(
                  "text-base",
                  showAnswer && option === answer && "text-green-700 dark:text-green-500 font-medium",
                  showAnswer && selectedOption === option && option !== answer && "text-red-700 dark:text-red-500 font-medium",
                  direction === "fr-to-ar" && "arabic-text" // Ajouter la classe pour les options en arabe
                )}
              >
                {option}
              </Label>
              {showAnswer && option === answer && direction === "fr-to-ar" && currentWord.audio && (
                <AudioButton audioUrl={currentWord.audio} word={option} />
              )}
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {showAnswer && (
        <div className={cn(
          "p-4 rounded-md",
          isCorrect ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        )}>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <p className="font-medium">
              {isCorrect ? t("QUIZ.CORRECT") : t("QUIZ.INCORRECT")}
            </p>
          </div>
          {!isCorrect && (
            <p className="mt-1 flex items-center gap-2">
              La réponse correcte est: <span className="font-bold">{answer}</span>
              {direction === "fr-to-ar" && currentWord.audio && (
                <AudioButton audioUrl={currentWord.audio} word={currentWord.arabic} />
              )}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          {t("QUIZ.RESET")}
        </Button>
        
        {showAnswer ? (
          <Button onClick={handleNextWord}>
            {t("QUIZ.NEXT_WORD")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOption}
          >
            {t("QUIZ.SHOW_ANSWER")}
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground mt-2">
        Score actuel: {score.correct}/{score.total}
      </div>
    </div>
  );
}