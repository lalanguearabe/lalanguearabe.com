import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { QuizQuestion } from '@/components/quiz-section';

const coursesDirectory = path.join(process.cwd(), 'content/courses');
const quizzesDirectory = path.join(process.cwd(), 'content/quizzes');

export interface CourseMetadata {
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  slug: string;
}

export interface Course extends CourseMetadata {
  content: string;
  quiz: {
    title: string;
    questions: QuizQuestion[];
  };
}

export function getAllCourses(): CourseMetadata[] {
  // Get file names under /content/courses
  const fileNames = fs.readdirSync(coursesDirectory);
  const allCoursesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(coursesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the course metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        ...(matterResult.data as Omit<CourseMetadata, 'slug'>),
      };
    }).sort((a, b) => {
      // Trier par ordre alphabétique du titre
      return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' });
    });

  // Sort courses by date
  return allCoursesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getCourseBySlug(slug: string): Course {
  const fullPath = path.join(coursesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the course metadata section
  const matterResult = matter(fileContents);

  // Get quiz data for the course
  const quiz = getQuizForCourse(slug);

  // Combine the data with the slug and content
  return {
    slug,
    content: matterResult.content,
    quiz,
    ...(matterResult.data as Omit<CourseMetadata, 'slug'>),
  };
}

export function getAllCourseSlugs() {
  const fileNames = fs.readdirSync(coursesDirectory);
  
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        slug: fileName.replace(/\.md$/, ''),
      };
    });
}

function getQuizForCourse(slug: string): { title: string; questions: QuizQuestion[] } {
  try {
    // Try to load quiz from JSON file
    const quizPath = path.join(quizzesDirectory, `${slug}.json`);
    if (fs.existsSync(quizPath)) {
      const quizContent = fs.readFileSync(quizPath, 'utf8');
      return JSON.parse(quizContent);
    }
  } catch (error) {
    console.error(`Error loading quiz for ${slug}:`, error);
  }
  
  // Return empty quiz if no file exists or there was an error
  return { title: 'Quiz', questions: [] };
}