import { LearningProgress } from '../../types';
import { getStoredProgress, saveStoredProgress, markLessonCompleted, markTaskCompleted } from '../../utils/progressManager';
import { syncService } from '../sync/syncService';

export interface QuizEvaluationResult {
  score: number;
  total: number;
  percentage: number;
  adaptiveRecommendation: 'advance' | 'review_section' | 'recap_and_easy';
  feedbackText: string;
  feedbackTextMr: string;
}

export const learningService = {
  getProgress(): LearningProgress {
    return getStoredProgress();
  },

  saveProgress(progress: LearningProgress): LearningProgress {
    saveStoredProgress(progress);
    syncService.enqueue('learningProgress', 'upsert', progress);
    return progress;
  },

  /**
   * Deterministic quiz scoring against structured lesson data
   * Correct answers are determined strictly from local answer keys, NEVER guessed by AI
   */
  evaluateQuiz(
    userAnswers: Record<number, number>,
    answerKey: Record<number, number>,
    totalQuestions = 3
  ): QuizEvaluationResult {
    let score = 0;
    for (let i = 0; i < totalQuestions; i++) {
      if (userAnswers[i] === answerKey[i]) {
        score++;
      }
    }

    const percentage = Math.round((score / totalQuestions) * 100);

    // Adaptive logic:
    // 3/3 -> advance
    // 2/3 -> suggest review
    // 0-1/3 -> recap and retry
    let adaptiveRecommendation: QuizEvaluationResult['adaptiveRecommendation'] = 'advance';
    let feedbackText = 'Excellent! You demonstrated solid diagnostic understanding.';
    let feedbackTextMr = 'उत्कृष्ट! तुम्हाला मोबाईलमधील घटकांची तपासणी अचूक समजली आहे.';

    if (score === 2) {
      adaptiveRecommendation = 'review_section';
      feedbackText = 'Good effort! Review the Battery Safety check before opening your practical task.';
      feedbackTextMr = 'छान प्रयत्न! प्रॅक्टिकल टास्क सुरू करण्यापूर्वी बॅटरी सुरक्षेचा भाग पुन्हा एकदा तपासा.';
    } else if (score <= 1) {
      adaptiveRecommendation = 'recap_and_easy';
      feedbackText = 'Let’s recap the main 3 parts together with an audio replay, then try again.';
      feedbackTextMr = 'चला ऑडिओ ऐकून मुख्य ३ भागांची पुन्हा उजळणी करूया, मग पुन्हा प्रयत्न करा.';
    }

    return {
      score,
      total: totalQuestions,
      percentage,
      adaptiveRecommendation,
      feedbackText,
      feedbackTextMr,
    };
  },

  completeLessonWithQuiz(
    lessonId: string,
    score: number,
    total: number,
    attempts = 1
  ): LearningProgress {
    const updated = markLessonCompleted(lessonId, { score, total, attempts });
    syncService.enqueue('learningProgress', 'update', { lessonId, score, total, attempts });
    return updated;
  },

  completeTask(taskId: string): LearningProgress {
    const updated = markTaskCompleted(taskId);
    syncService.enqueue('learningProgress', 'update', { taskId, status: 'completed' });
    return updated;
  },
};
