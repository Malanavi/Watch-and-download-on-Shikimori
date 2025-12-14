import HttpClient from "./apiServices/HttpClient";
import ApiErrorHandler from "./apiServices/ApiErrorHandler";

interface AnimeData {
  name?: string;
  english?: string[];
  russian?: string;
  user_rate?: {
    episodes?: number;
  };
}

class ShikimoriService {
  private readonly httpClient: HttpClient;
  private readonly errorHandler: ApiErrorHandler;

  constructor() {
    this.httpClient = new HttpClient();
    this.errorHandler = new ApiErrorHandler();
  }

  async getWatchingEpisode(animeId: number): Promise<number> {
    const data: AnimeData | null = await this.fetchAnimeData(animeId);
    return (data?.user_rate?.episodes || 0) + 1;
  }

  async getAnimeName(animeId: number): Promise<string | null> {
    const data: AnimeData | null = await this.fetchAnimeData(animeId);
    return data?.name || data?.english?.[0] || data?.russian || null;
  }

  getAnimeId(pathname: string): number | null {
    const match: RegExpMatchArray | null = pathname
      .match(/\/animes\/[a-z]*(\d+)-[\w-]+$/);

    if (match === null || !match[1]) {
      return null;
    }

    return parseInt(match[1], 10);
  }

  private async fetchAnimeData(animeId: number): Promise<AnimeData | null> {
    const url = `${window.location.protocol}//${window.location.hostname}/api/animes/${animeId}`;
    try {
      const response: Response = await this.httpClient.get(url);
      return await this.errorHandler.handleResponse<AnimeData>(response);
    } catch (error: unknown) {
      this.errorHandler.handleError(error);
      return null;
    }
  }
}

export default ShikimoriService;
