import { LearningProgress } from '../types';
import { getStoredProgress, saveStoredProgress } from './progressManager';

const OFFLINE_LESSON_CONTENT_KEY = 'kaushalsetu_cached_lesson_data';

export interface CachedLessonContent {
  id: string;
  title: string;
  cachedAt: string;
  sizeBytes: number;
}

export function isLessonAvailableOffline(lessonId: string): boolean {
  const progress = getStoredProgress();
  return progress.downloadedLessons.includes(lessonId);
}

export function isWeekDownloaded(weekNumber: number): boolean {
  const progress = getStoredProgress();
  return progress.downloadedWeeks.includes(weekNumber);
}

export function downloadWeekOffline(weekNumber: number, lessonIds: string[]): LearningProgress {
  const progress = getStoredProgress();
  const weeks = Array.from(new Set([...progress.downloadedWeeks, weekNumber]));
  const lessons = Array.from(new Set([...progress.downloadedLessons, ...lessonIds]));

  const updated: LearningProgress = {
    ...progress,
    downloadedWeeks: weeks,
    downloadedLessons: lessons,
  };

  saveStoredProgress(updated);

  // Store marker in local storage
  try {
    const existing = JSON.parse(localStorage.getItem(OFFLINE_LESSON_CONTENT_KEY) || '[]');
    const newItems = lessonIds.map((id) => ({
      id,
      title: id,
      cachedAt: new Date().toISOString(),
      sizeBytes: 2 * 1024 * 1024, // ~2MB per lesson
    }));
    localStorage.setItem(OFFLINE_LESSON_CONTENT_KEY, JSON.stringify([...existing, ...newItems]));
  } catch {
    // ignore
  }

  return updated;
}

export function removeWeekDownload(weekNumber: number, lessonIds: string[]): LearningProgress {
  const progress = getStoredProgress();
  const weeks = progress.downloadedWeeks.filter((w) => w !== weekNumber);
  const lessons = progress.downloadedLessons.filter((id) => !lessonIds.includes(id));

  const updated: LearningProgress = {
    ...progress,
    downloadedWeeks: weeks,
    downloadedLessons: lessons,
  };

  saveStoredProgress(updated);
  return updated;
}
