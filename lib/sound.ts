import fs from 'fs';
import path from 'path';
import { SoundWord, SoundList } from '@/lib/types';

const soundDirectory = path.join(process.cwd(), 'content/audio');

export function getSoundBySlug(slug: string): SoundList {
  try {
    const fullPath = path.join(soundDirectory, `${slug}.json`);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents);
    }
  } catch (error) {
    console.error(`Error loading sound for ${slug}:`, error);
  }
  
  // Return empty sound if no file exists or there was an error
  return { title: 'Sound', sounds: [] };
}