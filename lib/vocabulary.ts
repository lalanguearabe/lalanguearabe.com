import fs from 'fs';
import path from 'path';
import { VocabularyWord } from '@/components/quiz/vocabulary-quiz';

const vocabularyDirectory = path.join(process.cwd(), 'content/vocabulary');

export interface VocabularyList {
  title: string;
  words: VocabularyWord[];
}

export function getVocabularyBySlug(slug: string): VocabularyList {
  try {
    const fullPath = path.join(vocabularyDirectory, `${slug}.json`);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents);
    }
  } catch (error) {
    console.error(`Error loading vocabulary for ${slug}:`, error);
  }
  
  // Return empty vocabulary if no file exists or there was an error
  return { title: 'Vocabulaire', words: [] };
}