export type PageObserverOptions = {
  debounceMs?: number;
  enableMutationObserver?: boolean;
  mutationObserverConfig?: MutationObserverInit;
};

export type Unsubscribe = () => void;

type PushStateFn = (
  data: unknown,
  unused: string,
  url?: string | URL | null,
) => void;

export class PageObserver {
  private static instance: PageObserver | null = null;

  private readonly callbacks = new Set<() => void>();
  private mutationObserver: MutationObserver | null = null;

  private originalPushState: PushStateFn | null = null;

  private readonly debouncedNotify: () => void;
  private readonly debounceMs: number;
  private readonly enableMutationObserver: boolean;
  private readonly mutationObserverConfig: MutationObserverInit;

  private isDestroyed = false;

  private constructor(opts: PageObserverOptions = {}) {
    this.debounceMs = opts.debounceMs ?? 100;
    this.enableMutationObserver = opts.enableMutationObserver ?? true;
    this.mutationObserverConfig =
      opts.mutationObserverConfig ?? { childList: true, subtree: true };

    this.debouncedNotify = this.debounce(() => this.notify(), this.debounceMs);

    this.init();
  }

  public static getInstance(opts: PageObserverOptions = {}): PageObserver {
    if (!PageObserver.instance) {
      PageObserver.instance = new PageObserver(opts);
    }

    return PageObserver.instance;
  }

  public subscribe(callback: () => void): Unsubscribe {
    if (this.isDestroyed) {
      return (): void => {};
    }

    this.callbacks.add(callback);

    return () => {
      this.callbacks.delete(callback);
    };
  }

  public disconnect(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;

    document.removeEventListener('turbolinks:load', this.debouncedNotify);
    document.removeEventListener('turbo:load', this.debouncedNotify);
    window.removeEventListener('popstate', this.debouncedNotify);
    window.removeEventListener('DOMContentLoaded', this.debouncedNotify);

    if (this.originalPushState) {
      history.pushState = this.originalPushState;
      this.originalPushState = null;
    }

    this.mutationObserver?.disconnect();
    this.mutationObserver = null;

    this.callbacks.clear();
  }

  private notify(): void {
    if (this.isDestroyed) return;

    for (const callback of this.callbacks) {
      try {
        callback();
      } catch {
        // ignored
      }
    }
  }

  private init(): void {
    if (this.isDestroyed) return;

    this.addNavigationListeners();
    this.patchHistoryPushState();
    this.setupInitialTrigger();
    this.setupMutationObserver();
  }

  private addNavigationListeners(): void {
    document.addEventListener('turbolinks:load', this.debouncedNotify, {
      passive: true,
    });
    document.addEventListener('turbo:load', this.debouncedNotify, {
      passive: true,
    });
    window.addEventListener('popstate', this.debouncedNotify, {
      passive: true,
    });
  }

  private patchHistoryPushState(): void {
    if (typeof history.pushState !== 'function') return;

    this.originalPushState = history.pushState.bind(history);

    history.pushState = (
      data: unknown,
      unused: string,
      url?: string | URL | null,
    ): void => {
      this.originalPushState?.(data, unused, url);
      this.debouncedNotify();
    };
  }

  private setupInitialTrigger(): void {
    if (
      document.readyState === 'complete'
      || document.readyState === 'interactive'
    ) {
      queueMicrotask(this.debouncedNotify);
      return;
    }

    window.addEventListener(
      'DOMContentLoaded',
      this.debouncedNotify,
      { once: true, passive: true },
    );
  }

  private setupMutationObserver(): void {
    if (
      !this.enableMutationObserver
      || typeof MutationObserver === 'undefined'
    ) {
      return;
    }

    const root =
      document.documentElement
      ?? document.body
      ?? document;

    this.mutationObserver = new MutationObserver(this.debouncedNotify);
    this.mutationObserver.observe(root, this.mutationObserverConfig);
  }

  private debounce<T extends () => void>(
    fn: T,
    delay: number,
  ): () => void {
    let timer: ReturnType<typeof setTimeout> | undefined;

    return (): void => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        timer = undefined;
        fn();
      }, delay);
    };
  }
}

export default PageObserver;
