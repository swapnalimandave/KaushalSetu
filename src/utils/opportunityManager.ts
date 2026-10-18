import { Opportunity, ApplicationPreparation } from '../types';
import { DEMO_OPPORTUNITIES, INITIAL_APPLICATION_PREPARATION } from '../data/opportunitiesData';

const OPPORTUNITIES_STORAGE_KEY = 'kaushalsetu_opportunities';
const APPLICATION_STORAGE_KEY = 'kaushalsetu_application_prep';

export function getStoredOpportunities(): Opportunity[] {
  try {
    const saved = localStorage.getItem(OPPORTUNITIES_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as Opportunity[];
    }
  } catch {
    // fallback
  }
  return DEMO_OPPORTUNITIES;
}

export function saveStoredOpportunities(opps: Opportunity[]): void {
  try {
    localStorage.setItem(OPPORTUNITIES_STORAGE_KEY, JSON.stringify(opps));
  } catch {
    // quota
  }
}

export function toggleOpportunitySaved(oppId: string): Opportunity[] {
  const current = getStoredOpportunities();
  const updated = current.map((item) =>
    item.id === oppId ? { ...item, saved: !item.saved } : item
  );
  saveStoredOpportunities(updated);
  return updated;
}

export function getStoredApplication(): ApplicationPreparation {
  try {
    const saved = localStorage.getItem(APPLICATION_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as ApplicationPreparation;
    }
  } catch {
    // fallback
  }
  return INITIAL_APPLICATION_PREPARATION;
}

export function saveStoredApplication(app: ApplicationPreparation): void {
  try {
    localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(app));
  } catch {
    // quota
  }
}

export function toggleApplicationStep(stepId: string): ApplicationPreparation {
  const current = getStoredApplication();
  const updatedSteps = current.steps.map((s) =>
    s.id === stepId ? { ...s, done: !s.done } : s
  );
  const allDone = updatedSteps.every((s) => s.done);
  const updated: ApplicationPreparation = {
    ...current,
    steps: updatedSteps,
    status: allDone ? 'ready_to_visit' : 'in_preparation',
  };
  saveStoredApplication(updated);
  return updated;
}

export function markApplicationSubmitted(): ApplicationPreparation {
  const current = getStoredApplication();
  const updated: ApplicationPreparation = {
    ...current,
    status: 'applied',
  };
  saveStoredApplication(updated);
  return updated;
}
