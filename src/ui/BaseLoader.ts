import PageObserver from "@/services/PageObserver";

export abstract class BaseLoader {
  private readonly unsubscribe: () => void;

  private isRunning = false;
  private pendingRun = false;

  private lastHref: string | null = null;
  private lastRunAt = 0;
  private readonly minIntervalMs = 250;

  constructor() {
    this.unsubscribe = PageObserver
      .getInstance()
      .subscribe(() => {
        void this.safeRun();
      });

    if (typeof queueMicrotask === "function") {
      queueMicrotask(() => {
        void this.safeRun();
      });
    } else {
      void Promise.resolve().then(() => this.safeRun());
    }
  }

  protected abstract runOnViewChange(): Promise<void>;

  public destroy(): void {
    this.unsubscribe();
  }

  private async safeRun(): Promise<void> {
    const currentHref = window.location.href;

    if (this.lastHref !== null && this.lastHref === currentHref) {
      this.pendingRun = false;
      return;
    }

    const now = Date.now();
    if (now - this.lastRunAt < this.minIntervalMs) {
      this.pendingRun = true;
      return;
    }

    if (this.isRunning) {
      this.pendingRun = true;
      return;
    }

    this.isRunning = true;

    try {
      await this.runOnViewChange();
    } finally {
      this.isRunning = false;
      this.lastRunAt = Date.now();
      this.lastHref = window.location.href;

      if (this.pendingRun) {
        this.pendingRun = false;

        if (typeof queueMicrotask === "function") {
          queueMicrotask(() => {
            void this.safeRun();
          });
        } else {
          void Promise.resolve().then(() => this.safeRun());
        }
      }
    }
  }
}
