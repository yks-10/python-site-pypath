import { LESSONS } from './lessonContent.js';
import { LESSONS_ADVANCED } from './lessonContent2.js';
import { LESSONS_EXPANDED } from './lessonContent3.js';
import { LESSONS_EXPERT_EXPANDED } from './lessonContent4.js';

// Merge all lesson content — later imports override earlier for the same key
// lessonContent3 + lessonContent4 contain full rewrites of previously short lessons
export const ALL_LESSONS = {
  ...LESSONS,
  ...LESSONS_ADVANCED,
  ...LESSONS_EXPANDED,
  ...LESSONS_EXPERT_EXPANDED,
};
