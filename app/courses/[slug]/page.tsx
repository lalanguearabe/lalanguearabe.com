import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCourseSlugs, getCourseBySlug } from "@/lib/courses";
import { getVocabularyBySlug } from "@/lib/vocabulary";
import { getSoundBySlug } from "@/lib/sound";
import { CourseContent } from "@/components/course-content";
import { QuizSection } from "@/components/quiz-section";
import { VocabularyQuiz } from "@/components/quiz/vocabulary-quiz";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SoundQuiz } from "@/components/quiz/sound-quiz";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  try {
    const course = getCourseBySlug(params.slug);
    return {
      title: `${course.title} |  lalanguearabe.com`,
      description: course.description,
    };
  } catch (error) {
    return {
      title: "Cours non trouvé |  lalanguearabe.com",
      description: "Le cours que vous recherchez n'existe pas",
    };
  }
}

export async function generateStaticParams() {
  const paths = getAllCourseSlugs();
  return paths;
}

export default function CoursePage({ params }: CoursePageProps) {
  try {
    const course = getCourseBySlug(params.slug);
    const vocabulary = getVocabularyBySlug(params.slug);
    const sound = getSoundBySlug(params.slug);
    const formattedDate = format(new Date(course.date), "d MMMM yyyy", { locale: fr });

    return (
      <article className="container py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Course Header */}
          <div className="mb-8">
            <div className="relative h-[300px] w-full mb-6 rounded-lg overflow-hidden">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold md:text-4xl mb-4">{course.title}</h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{course.author}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-xl text-muted-foreground">{course.description}</p>
          </div>

          {/* Course Content with Tabs */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="vocabulary">Vocabulaire</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
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
                      title={`${vocabulary.title || "Vocabulaire"} - Arabe vers Français`} 
                      words={vocabulary.words}
                      direction="ar-to-fr"
                    />
                  </div>
                  <div className="mt-8">
                    <SoundQuiz 
                      title={`${sound.title || "Sound"} - Arabe vers Français`} 
                      sounds={sound.sounds}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-muted rounded-lg">
                  <p>Aucun vocabulaire disponible pour cette leçon.</p>
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
                  <p>Aucun quiz disponible pour cette leçon.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </article>
    );
  } catch (error) {
    notFound();
  }
}