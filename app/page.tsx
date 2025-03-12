import { getAllCourses } from "@/lib/courses";
import { HomeClient } from "@/components/home-client";

export default function Home() {
  const courses = getAllCourses();
  
  return <HomeClient courses={courses} />;
}