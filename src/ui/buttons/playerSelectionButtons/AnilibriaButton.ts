import {PLAYER_TYPES} from "@/constants";
import {
  type AniLibriaSearchResult,
  type AniLibriaSearchItem,
} from "@/services/playerProviderServices/AnilibriaService";
import DomHelper from "@/helpers/DomHelper";
import type AbstractPlayer from "@/ui/players/AbstractPlayer";
import playerFactory from "@/ui/players/PlayerFactory";
import AnilibriaLookupService from "@/services/playerProviderServices/AnilibriaLookupService";

interface ButtonParams {
  animeId: number;
  nameOfAnime: string;
}

class AnilibriaButton {
  public create(params: ButtonParams): HTMLAnchorElement {
    const button = DomHelper.createElement<HTMLAnchorElement>(
      "a",
      {
        className: "anilibria-button",
        textContent: PLAYER_TYPES.ANILIBRIA,
      }
    );

    button.addEventListener("click", (event: MouseEvent): void => {
      event.preventDefault();
      void this.handleClick(params);
    });

    return button;
  }

  private async handleClick(params: ButtonParams): Promise<void> {
    this.removeExistingPlayers();

    const lookup = AnilibriaLookupService.getInstance();
    const results: AniLibriaSearchResult | null =
      await lookup.getOrFetch(params.nameOfAnime);

    if (!results || results.length === 0) {
      return;
    }

    const firstResult: AniLibriaSearchItem | undefined = results[0];

    if (!firstResult) {
      return;
    }

    const block = document
      .querySelector<HTMLElement>(".block-with-player");

    if (!block) {
      return;
    }

    const player: AbstractPlayer = playerFactory.createPlayer(
      PLAYER_TYPES.ANILIBRIA,
      firstResult.id,
    );

    await player.appendPlayerToBlock(block);
  }

  private removeExistingPlayers(): void {
    document
      .querySelectorAll(".iframe-player")
      .forEach((player) => player.remove());
  }
}

export default AnilibriaButton;
