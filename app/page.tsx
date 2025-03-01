import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllCourses } from "@/lib/courses";
import { CourseCard } from "@/components/ui/course-card";
import { BookOpen, GraduationCap, Lightbulb } from "lucide-react";

export default function Home() {
  const arabicCourses = getAllCourses();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Apprenez l'arabe à votre rythme avec  lalanguearabe.com
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Découvrez notre méthode progressive d'apprentissage de l'arabe.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/courses">
                <Button size="lg">Voir tous les cours</Button>
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
                Cours d&apos;arabe
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Suivez notre programme structuré pour apprendre l&apos;arabe, leçon par leçon.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {arabicCourses.map((course, index) => (
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
                Pourquoi choisir notre méthode?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Notre approche d&apos;apprentissage de l&apos;arabe est conçue pour vous faire progresser naturellement.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card">
              <div className="rounded-full bg-primary/10 p-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Progression naturelle</h3>
              <p className="text-center text-muted-foreground">
                Apprenez comme un enfant natif, en commençant par les structures fondamentales.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card">
              <div className="rounded-full bg-primary/10 p-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Exercices pratiques</h3>
              <p className="text-center text-muted-foreground">
                Chaque leçon contient des exercices et des quiz pour renforcer votre apprentissage.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card">
              <div className="rounded-full bg-primary/10 p-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Approche structurée</h3>
              <p className="text-center text-muted-foreground">
                Un parcours clair et organisé, du débutant à l&apos;avancé, sans sauter d&apos;étapes essentielles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}