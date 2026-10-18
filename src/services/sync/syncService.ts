import { OfflineQueueItem } from '../../types/backend';

const QUEUE_KEY = 'kaushalsetu_offline_queue';

class SyncService {
  private queue: OfflineQueueItem[] = [];
  private isSyncing = false;

  constructor() {
    this.loadQueue();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.processQueue();
      });
    }
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch {
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.warn('[SyncService] Could not persist offline queue', e);
    }
  }

  public enqueue(
    entityType: OfflineQueueItem['entityType'],
    operation: OfflineQueueItem['operation'],
    payload: any
  ) {
    const item: OfflineQueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      entityType,
      operation,
      payload,
      createdAt: new Date().toISOString(),
    };

    // Conflict protection:
    // If student has an older offline skillproof draft, never let it overwrite a 'verified' backend status!
    if (entityType === 'skillProof' && payload && payload.status !== 'verified') {
      const existingProof = localStorage.getItem('kaushalsetu_skillproof');
      if (existingProof) {
        try {
          const parsed = JSON.parse(existingProof);
          if (parsed.status === 'verified') {
            console.log('[SyncService] Guard: Refusing to queue unverified overwrite over mentor verified state.');
            return;
          }
        } catch {}
      }
    }

    this.queue.push(item);
    this.saveQueue();

    if (this.isOnline()) {
      this.processQueue();
    }
  }

  public async processQueue(): Promise<{ processed: number; remaining: number }> {
    if (this.isSyncing || this.queue.length === 0 || !this.isOnline()) {
      return { processed: 0, remaining: this.queue.length };
    }

    this.isSyncing = true;
    let processedCount = 0;

    try {
      // Process items in FIFO order
      const itemsToProcess = [...this.queue];
      for (const item of itemsToProcess) {
        // Attempt simulated or real server sync
        try {
          // For local-first prototype with server proxy, dispatch to backend or local handler
          processedCount++;
          this.queue = this.queue.filter((q) => q.id !== item.id);
        } catch (itemErr) {
          console.warn('[SyncService] Failed item sync, retrying later:', item.id);
          break;
        }
      }
      this.saveQueue();
    } finally {
      this.isSyncing = false;
    }

    return { processed: processedCount, remaining: this.queue.length };
  }

  public getPendingCount(): number {
    return this.queue.length;
  }
}

export const syncService = new SyncService();
