"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SoundList } from "@/lib/types";
import { AudioButton } from "@/components/audio-button";
import { useTranslation } from "react-i18next";
type SoundQuizProps = SoundList;

interface QuizModeProps {
  sounds: SoundList["sounds"];
}

export function SoundQuiz({ title, sounds }: SoundQuizProps) {
  const [quizMode, setQuizMode] = useState<"writing" | "mcq">("writing");
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Testez vos connaissances de vocabulaire avec des exercices audio et écrit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="writing" onValueChange={(value) => setQuizMode(value as "writing" | "mcq")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="writing">Mode écriture</TabsTrigger>
            <TabsTrigger value="mcq">Mode QCM</TabsTrigger>
          </TabsList>
          <TabsContent value="writing">
            <WritingModeQuiz sounds={sounds} />
          </TabsContent>
          <TabsContent value="mcq">
            <MCQModeQuiz sounds={sounds} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function WritingModeQuiz({ sounds }: QuizModeProps) {
  const { t } = useTranslation();
  const [currentSoundIndex, setCurrentSoundIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [shuffledSounds, setShuffledSounds] = useState<SoundList["sounds"]>([]);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // Mélanger les sons au chargement du composant
  useEffect(() => {
    const shuffled = [...sounds].sort(() => Math.random() - 0.5);
    setShuffledSounds(shuffled);
  }, [sounds]);

  const currentSound = shuffledSounds[currentSoundIndex];

  const handleSubmit = () => {
    if (!currentSound) return;
    
    // Always compare against Arabic since we're always expecting Arabic input
    const correctAnswer = currentSound.arabic;
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);
    setScore(prev => ({
      correct: isAnswerCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const handleNextSound = () => {
    if (currentSoundIndex < shuffledSounds.length - 1) {
      setCurrentSoundIndex(prev => prev + 1);
    } else {
      // Mélanger à nouveau les sons si on a fait le tour
      const newShuffled = [...sounds].sort(() => Math.random() - 0.5);
      setShuffledSounds(newShuffled);
      setCurrentSoundIndex(0);
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
    const newShuffled = [...sounds].sort(() => Math.random() - 0.5);
    setShuffledSounds(newShuffled);
    setCurrentSoundIndex(0);
    setUserAnswer("");
    setIsCorrect(null);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  };

  if (!currentSound) {
    return <div>{t("QUIZ.LOADING")}</div>;
  }

  // Always use Arabic for answer
  const answer = currentSound.arabic;
  // Always label as Arabic
  const answerLabel = "Arabe";

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>Écoutez le son et écrivez ce que vous entendez</Label>
        <div className="flex gap-2 items-center">
          {currentSound && (
            <AudioButton 
              key={`writing-${currentSound.audio}-${currentSoundIndex}`} 
              url={`/sounds/${currentSound.audio}`} 
              label="Écouter" 
            />
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="answer">Arabe</Label>
        <div className="flex gap-2">
          <Input
            id="answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Entrez ce que vous entendez en arabe"
            disabled={showAnswer}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !showAnswer) {
                handleSubmit();
              }
            }}
            className={cn(
              isCorrect === true && "border-green-500 focus-visible:ring-green-500",
              isCorrect === false && "border-red-500 focus-visible:ring-red-500",
              "arabic-text" // Always add the class for Arabic text input
            )}
            dir="rtl" // Add RTL direction for Arabic text input
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
              {isCorrect ? "Correct!" : "Incorrect!"}
            </p>
          </div>
          {!isCorrect && (
            <p className="mt-1 flex items-center gap-2">
              La réponse correcte est: <span className={cn("font-bold", "arabic-text")}>{answer}</span>
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
          <Button onClick={handleNextSound}>
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

function MCQModeQuiz({ sounds }: QuizModeProps) {
  const { t } = useTranslation();
  const [currentSoundIndex, setCurrentSoundIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [shuffledSounds, setShuffledSounds] = useState<SoundList["sounds"]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // Mélanger les sons et générer les options au chargement
  useEffect(() => {
    if (sounds.length < 4) return; // Besoin d'au moins 4 sons pour les options
    
    const shuffled = [...sounds].sort(() => Math.random() - 0.5);
    setShuffledSounds(shuffled);
    
    // Générer les options pour le premier son
    generateOptions(shuffled, 0);
  }, [sounds]);

  // Générer les options pour un son donné
  const generateOptions = (soundsList: SoundList["sounds"], soundIndex: number) => {
    if (!soundsList.length || soundIndex >= soundsList.length) return;
    
    const currentSound = soundsList[soundIndex];
    // Always use Arabic for options
    const correctAnswer = currentSound.arabic;
    
    // Collecter toutes les réponses possibles (sauf la correcte)
    const otherAnswers = soundsList
      .filter((_, idx) => idx !== soundIndex)
      .map(sound => sound.arabic);
    
    // Sélectionner 3 réponses aléatoires
    const randomAnswers = [...otherAnswers]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Ajouter la réponse correcte et mélanger
    const allOptions = [...randomAnswers, correctAnswer].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentSound) return;
    
    // Since all options are in Arabic now, always compare with Arabic value
    const correctAnswer = currentSound.arabic;
    const isAnswerCorrect = selectedOption === correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);
    setScore(prev => ({
      correct: isAnswerCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const handleNextSound = () => {
    const nextIndex = currentSoundIndex < shuffledSounds.length - 1 ? currentSoundIndex + 1 : 0;
    
    if (nextIndex === 0) {
      // Si on recommence, mélanger à nouveau les sons
      const newShuffled = [...sounds].sort(() => Math.random() - 0.5);
      setShuffledSounds(newShuffled);
      generateOptions(newShuffled, 0);
    } else {
      generateOptions(shuffledSounds, nextIndex);
    }
    
    setCurrentSoundIndex(nextIndex);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handleReset = () => {
    const newShuffled = [...sounds].sort(() => Math.random() - 0.5);
    setShuffledSounds(newShuffled);
    setCurrentSoundIndex(0);
    generateOptions(newShuffled, 0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  };

  const currentSound = shuffledSounds[currentSoundIndex];

  if (!currentSound || options.length < 4) {
    return <div>{t("QUIZ.LOADING")}</div>;
  }

  // Always use Arabic for answer since options are all in Arabic now
  const answer = currentSound.arabic;

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>Écoutez le son et choisissez la bonne réponse</Label>
        <div className="flex gap-2 items-center">
          {currentSound && (
            <AudioButton 
              key={`mcq-${currentSound.audio}-${currentSoundIndex}`} 
              url={`/sounds/${currentSound.audio}`} 
              label="Écouter" 
            />
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="answer">Arabe</Label>
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
                  "arabic-text" // Ajouter la classe pour les options en arabe
                )}
              >
                {option}
              </Label>
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
              {t("QUIZ.CORRECT_ANSWER")} <span className={cn("font-bold", "arabic-text")}>{answer}</span>
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
          <Button onClick={handleNextSound}>
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
        {t("QUIZ.CURRENT_SCORE")}: {score.correct}/{score.total}
      </div>
    </div>
  );
}

