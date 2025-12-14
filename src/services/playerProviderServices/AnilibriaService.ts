import HttpClient from "../apiServices/HttpClient";
import ApiErrorHandler from "../apiServices/ApiErrorHandler";
import {SERVICE_URLS} from "@/constants";

export interface AniLibriaSearchItem {
  id: number;
  name: {
    main: string;
    english?: string;
    alternative?: string;
  };
  external_player?: string;
}

export type AniLibriaSearchResult = AniLibriaSearchItem[];

export interface AniLibriaTorrentItem {
  id: number;
  magnet: string;
  hash?: string;
  size?: number;
  label?: string;
  codec?: {
    value?: string;
    label?: string;
    label_color?: string | null;
    label_is_visible?: boolean;
  } | null;
  quality?: {
    value?: string;
  } | null;
  seeders?: number | null;
}

export type AniLibriaTorrentResult = AniLibriaTorrentItem[];

class AnilibriaService {
  private readonly httpClient: HttpClient;
  private readonly errorHandler: ApiErrorHandler;

  constructor() {
    this.httpClient = new HttpClient();
    this.errorHandler = new ApiErrorHandler();
  }

  async searchAnime(animeName: string): Promise<AniLibriaSearchResult | null> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const searchUrl: string = `${SERVICE_URLS.ANILIBRIA_API_SEARCH_URL}?query=${encodeURIComponent(animeName)}`;

    try {
      const response: Response = await this
        .httpClient
        .get(searchUrl, headers);

      return await this
        .errorHandler
        .handleResponse(response);
    } catch (error: unknown) {
      this
        .errorHandler
        .handleError(error);
    }
  }

  async getPlayerSource(animeId: number): Promise<string> {
    return `${SERVICE_URLS.ANILIBRIA_IFRAME_PLAYER_URL}?id=${animeId}`;
  }

  async getTorrentsByReleaseId(releaseId: number): Promise<AniLibriaTorrentResult | null> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const url: string = `${SERVICE_URLS.ANILIBRIA_API_TORRENT_URL}/${releaseId}`;

    try {
      const response: Response = await this
        .httpClient
        .get(url, headers);

      return await this
        .errorHandler
        .handleResponse(response);
    } catch (error: unknown) {
      this
        .errorHandler
        .handleError(error);
    }
  }
}

export default AnilibriaService;
