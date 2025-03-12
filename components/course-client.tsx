'use client';

import { CourseCard } from "@/components/ui/course-card";
import { useTranslation } from "react-i18next";

interface CourseClientProps {
  courses: any[];
}

export function CourseClient({ courses }: CourseClientProps) {
  const { t } = useTranslation();
  const arabicCourses = courses.sort((a, b) => {
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
            {t("COURSES.TITLE")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("COURSES.DESCRIPTION")}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {arabicCourses.map((course, index) => (
            <CourseCard
              key={course.slug}
              course={{
                ...course,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

