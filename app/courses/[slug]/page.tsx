import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCourseSlugs, getCourseBySlug } from "@/lib/courses";
import { getVocabularyBySlug } from "@/lib/vocabulary";
import { getSoundBySlug } from "@/lib/sound";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { ClientCourseTabs } from "@/components/client-course-tabs";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  try {
    const course = getCourseBySlug(params.slug);
    return {
      title: `${course.title}`,
      description: course.description,
    };
  } catch (error) {
    return {
      title: "Cours non trouvé ",
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
          <ClientCourseTabs 
            course={course} 
            vocabulary={vocabulary} 
            sound={sound} 
          />
        </div>
      </article>
    );
  } catch (error) {
    notFound();
  }
}