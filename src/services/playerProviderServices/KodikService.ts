import ShikimoriService from "../ShikimoriService";
import {SERVICE_URLS} from "@/constants";

class KodikService {
  private shikimoriService: ShikimoriService;

  constructor() {
    this.shikimoriService = new ShikimoriService();
  }

  async getPlayerSource(animeId: number): Promise<string> {
    const episode: number = await this
      .shikimoriService
      .getWatchingEpisode(animeId);

    return `${SERVICE_URLS.KODIK_IFRAME_PLAYER_URL}?shikimoriID=${animeId}&episode=${episode}`;
  }
}

export default KodikService;
