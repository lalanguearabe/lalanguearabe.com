"use client";

import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseContent } from "@/components/course-content";
import { VocabularyQuiz } from "@/components/quiz/vocabulary-quiz";
import { SoundQuiz } from "@/components/quiz/sound-quiz";
import { QuizSection } from "@/components/quiz-section";

interface ClientCourseTabsProps {
  course: {
    content: any;
    quiz: {
      title: string;
      questions: any[];
    };
  };
  vocabulary: {
    title: string;
    words: any[];
  };
  sound: {
    title: string;
    sounds: any[];
  };
}

export function ClientCourseTabs({ course, vocabulary, sound }: ClientCourseTabsProps) {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">{t("DETAILS.CONTENT")}</TabsTrigger>
        <TabsTrigger value="vocabulary">{t("DETAILS.VOCABULARY")}</TabsTrigger>
        <TabsTrigger value="quiz">{t("DETAILS.QUIZ")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="mt-6">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <CourseContent content={course.content} />
        </div>
      </TabsContent>
      
      <TabsContent value="vocabulary" className="mt-6">
        {vocabulary.words.length > 0 ? (
          <div className="space-y-8">
            <VocabularyQuiz 
              title={vocabulary.title || "Vocabulaire"} 
              words={vocabulary.words}
              direction="fr-to-ar"
            />
            
            <div className="mt-8">
              <VocabularyQuiz 
                title={`${vocabulary.title || "Vocabulaire"} - ${t("DETAILS.FRENCH_TO_ARABIC")}`} 
                words={vocabulary.words}
                direction="ar-to-fr"
              />
            </div>
            <div className="mt-8">
              <SoundQuiz 
                title={`${sound.title || "Sound"} - ${t("DETAILS.ARABIC_TO_FRENCH")}`} 
                sounds={sound.sounds}
              />
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-muted rounded-lg">
            <p>{t("DETAILS.NO_VOCABULARY")}</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="quiz" className="mt-6">
        {course.quiz.questions.length > 0 ? (
          <QuizSection 
            title={course.quiz.title} 
            questions={course.quiz.questions} 
          />
        ) : (
          <div className="p-6 text-center bg-muted rounded-lg">
            <p>{t("DETAILS.NO_QUIZ")}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
} 