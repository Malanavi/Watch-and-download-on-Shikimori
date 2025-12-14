import AnilibriaService, {
  type AniLibriaSearchResult,
} from "./AnilibriaService";

type CacheEntry = {
  result: AniLibriaSearchResult | null;
  timestamp: number;
};

class AnilibriaLookupService {
  private static instance: AnilibriaLookupService | null = null;

  private readonly provider = new AnilibriaService();
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  private readonly cache = new Map<string, CacheEntry>();
  private readonly inFlight = new Map<
    string,
    Promise<AniLibriaSearchResult | null>
  >();

  public static getInstance(): AnilibriaLookupService {
    if (AnilibriaLookupService.instance === null) {
      AnilibriaLookupService.instance = new AnilibriaLookupService();
    }
    return AnilibriaLookupService.instance;
  }

  private keyFor(name: string): string {
    return name.trim().toLowerCase();
  }

  public async getOrFetch(
    animeName: string,
  ): Promise<AniLibriaSearchResult | null> {
    const key = this.keyFor(animeName);

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }

    const inFlight = this.inFlight.get(key);
    if (inFlight) {
      return inFlight;
    }

    const promise = this.fetchAndCache(key, animeName);
    this.inFlight.set(key, promise);

    return promise;
  }

  private async fetchAndCache(
    key: string,
    animeName: string,
  ): Promise<AniLibriaSearchResult | null> {
    try {
      const result = await this
        .provider
        .searchAnime(animeName);

      this.cache.set(key, {
        result,
        timestamp: Date.now(),
      });

      return result;
    } catch {
      this.cache.set(key, {
        result: null,
        timestamp: Date.now(),
      });

      return null;
    } finally {
      this.inFlight.delete(key);
    }
  }
}

export default AnilibriaLookupService;
