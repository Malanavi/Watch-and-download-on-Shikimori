import ShowPlayerButton from "./buttons/ShowPlayerButton";
import ShikimoriService from "../services/ShikimoriService";
import {PLAYER_CLASSES} from "@/constants";
import PlayerStyleManager from "../services/playerServices/PlayerStyleManager";
import {BaseLoader} from "@/ui/BaseLoader";
import AnilibriaLookupService from "@/services/playerProviderServices/AnilibriaLookupService";
import type {AniLibriaSearchResult} from "@/services/playerProviderServices/AnilibriaService";

class ShowPlayerButtonLoader extends BaseLoader {
  private readonly shikimoriApi: ShikimoriService;
  private readonly styleManager: PlayerStyleManager;

  constructor() {
    super();

    this.shikimoriApi = new ShikimoriService();
    this.styleManager = new PlayerStyleManager();
  }

  protected async runOnViewChange(): Promise<void> {
    ShowPlayerButtonLoader.removeExistingElements();
    const animeId: number | null = this
      .shikimoriApi
      .getAnimeId(window.location.pathname);

    if (animeId === null) return;

    const animeName: string | null = await this
      .shikimoriApi
      .getAnimeName(animeId);

    if (animeName === null) return;

    const lookup: AnilibriaLookupService = AnilibriaLookupService
      .getInstance();
    const result: AniLibriaSearchResult | null = await lookup
      .getOrFetch(animeName);
    const showAniLibria: boolean = result !== null && result.length > 0;

    ShowPlayerButton.createShowButton({
      animeName,
      animeId,
      showAniLibria,
    });
    this.styleManager.setShowButtonInactiveStyle();
  }

  private static removeExistingElements(): void {
    ShowPlayerButtonLoader.removeElement(PLAYER_CLASSES.BUTTON);
    ShowPlayerButtonLoader.removeElement(PLAYER_CLASSES.PLAYER_BLOCK);
  }

  private static removeElement(selector: string): void {
    const element: Element | null = document.querySelector(selector);

    if (element === null) return;

    element.remove();
  }
}

export default ShowPlayerButtonLoader;
