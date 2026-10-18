import { LearningProgress } from '../types';

const PROGRESS_STORAGE_KEY = 'kaushalsetu_learning_progress';

export const INITIAL_PROGRESS: LearningProgress = {
  pathwayId: 'mobile-repair',
  overallProgress: 12, // Starting baseline progress
  currentWeek: 1,
  completedLessons: [],
  completedTasks: [],
  lessonQuizScores: {},
  downloadedWeeks: [1], // Week 1 downloaded for Ravi
  downloadedLessons: ['inside-a-smartphone', 'essential-repair-tools', 'safety-before-repair', 'common-phone-problems'],
  lastOpenedLessonId: 'inside-a-smartphone',
};

export function getStoredProgress(): LearningProgress {
  try {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as LearningProgress;
    }
  } catch {
    // fallback
  }
  return INITIAL_PROGRESS;
}

export function saveStoredProgress(progress: LearningProgress): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // quota exceeded or disabled
  }
}

export function markLessonCompleted(
  lessonId: string,
  quizResult?: { score: number; total: number; attempts: number }
): LearningProgress {
  const current = getStoredProgress();
  const completed = Array.from(new Set([...current.completedLessons, lessonId]));
  
  // Total lessons in 4 weeks is 16
  const calculatedPercent = Math.min(100, Math.round((completed.length / 16) * 100) + 12);

  const updated: LearningProgress = {
    ...current,
    completedLessons: completed,
    overallProgress: calculatedPercent,
    lastOpenedLessonId: lessonId,
    lessonQuizScores: quizResult
      ? { ...current.lessonQuizScores, [lessonId]: quizResult }
      : current.lessonQuizScores,
  };

  saveStoredProgress(updated);
  return updated;
}

export function markTaskCompleted(taskId: string): LearningProgress {
  const current = getStoredProgress();
  const completed = Array.from(new Set([...current.completedTasks, taskId]));
  const updated: LearningProgress = {
    ...current,
    completedTasks: completed,
  };
  saveStoredProgress(updated);
  return updated;
}

export function resetProgressToDemo(): LearningProgress {
  saveStoredProgress(INITIAL_PROGRESS);
  return INITIAL_PROGRESS;
}
