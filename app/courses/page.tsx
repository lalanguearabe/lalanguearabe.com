import { getAllCourses } from "@/lib/courses";
import { CourseClient } from "@/components/course-client"

export default function CoursesPage() {
  const courses = getAllCourses();
  return <CourseClient courses={courses} />
}