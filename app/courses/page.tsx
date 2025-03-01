import { getAllCourses } from "@/lib/courses";
import { CourseCard } from "@/components/ui/course-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tous les cours |  lalanguearabe.com",
  description: "Découvrez tous nos cours d'arabe disponibles sur  lalanguearabe.com",
};

export default function CoursesPage() {
  const arabicCourses = getAllCourses().sort((a, b) => {
    // Trier par numéro de leçon si présent
    const lessonA = a.slug.match(/lecon-(\d+)/);
    const lessonB = b.slug.match(/lecon-(\d+)/);
    
    if (lessonA && lessonB) {
      return parseInt(lessonA[1]) - parseInt(lessonB[1]);
    } else if (lessonA) {
      return -1;
    } else if (lessonB) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-bold tracking-tight lg:text-5xl">
            Tous les cours d'arabe
          </h1>
          <p className="text-xl text-muted-foreground">
            Explorez notre méthode progressive d'apprentissage de l'arabe.
          </p>
        </div>
      </div>
      
      <div className="mt-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {arabicCourses.map((course, index) => (
            <CourseCard 
              key={course.slug} 
              course={{
                ...course
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}