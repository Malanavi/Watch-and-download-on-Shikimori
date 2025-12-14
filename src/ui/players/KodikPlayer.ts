import AbstractPlayer from "./AbstractPlayer";
import KodikService from "../../services/playerProviderServices/KodikService";

class KodikPlayer extends AbstractPlayer<HTMLIFrameElement> {
  private readonly kodikService: KodikService;

  constructor(animeId: number) {
    super(animeId);
    this.kodikService = new KodikService();
  }

  protected async createPlayer(): Promise<HTMLIFrameElement> {
    const iframeSrc: string = await this
      .kodikService
      .getPlayerSource(this.animeId);

    return AbstractPlayer.createIframe(
      iframeSrc,
    );
  }
}

export default KodikPlayer;
