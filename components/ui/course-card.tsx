"use client";

import { CourseMetadata } from "@/lib/courses";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CourseCardProps {
  course: CourseMetadata;
}

export function CourseCard({ course }: CourseCardProps) {
  const formattedDate = format(new Date(course.date), "d MMMM yyyy", { locale: fr });
  
  return (
    <Link href={`/courses/${course.slug}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{course.title}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">{course.description}</p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {course.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline">+{course.tags.length - 3}</Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}