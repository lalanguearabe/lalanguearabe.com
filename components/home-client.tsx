"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/ui/course-card";
import { BookOpen, GraduationCap, Lightbulb, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HomeClientProps {
  courses: any[];
}

export function HomeClient({ courses }: HomeClientProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                {t('MAIN.HERO.TITLE')}
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                {t('MAIN.HERO.DESCRIPTION')}
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/courses">
                <Button size="lg">{t('MAIN.HERO.CTA')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Arabic Courses Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t('MAIN.COURSES.TITLE')}
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                {t('MAIN.COURSES.DESCRIPTION')}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {courses.map((course) => (
              <CourseCard 
                key={course.slug} 
                course={{
                  ...course,
                  title: course.title,
                }} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t('MAIN.WHY_CHOOSE_US.TITLE')}
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                {t('MAIN.WHY_CHOOSE_US.DESCRIPTION')}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card">
              <div className="rounded-full bg-primary/10 p-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {t('MAIN.WHY_CHOOSE_US.FEATURES.NATURAL_PROGRESSION')}
              </h3>
              <p className="text-center text-muted-foreground">
                {t('MAIN.WHY_CHOOSE_US.FEATURES.NATURAL_PROGRESSION_DESCRIPTION')}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card">
              <div className="rounded-full bg-primary/10 p-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {t('MAIN.WHY_CHOOSE_US.FEATURES.STRUCTURED_PROGRAM')}
              </h3>
              <p className="text-center text-muted-foreground">
                {t('MAIN.WHY_CHOOSE_US.FEATURES.STRUCTURED_PROGRAM_DESCRIPTION')}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card">
              <div className="rounded-full bg-primary/10 p-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {t('MAIN.WHY_CHOOSE_US.FEATURES.COLLABORATIVE_PROJECT')}
              </h3>
              <p className="text-center text-muted-foreground">
                {t('MAIN.WHY_CHOOSE_US.FEATURES.COLLABORATIVE_PROJECT_DESCRIPTION')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 