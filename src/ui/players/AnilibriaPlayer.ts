import AbstractPlayer from "./AbstractPlayer";
import anilibriaService from "../../services/playerProviderServices/AnilibriaService";

class AnilibriaPlayer extends AbstractPlayer<HTMLIFrameElement> {
  private anilibriaService: anilibriaService;

  constructor(animeId: number) {
    super(animeId);
    this.anilibriaService = new anilibriaService();
  }

  protected async createPlayer(): Promise<HTMLIFrameElement> {
    const iframeSrc: string = await this
      .anilibriaService
      .getPlayerSource(this.animeId);

    return AbstractPlayer.createIframe(
      iframeSrc,
    );
  }
}

export default AnilibriaPlayer;
