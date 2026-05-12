import buttonFactory from "../../ui/buttons/playerSelectionButtons/ButtonFactory";
import DomHelper from "@/helpers/DomHelper";
import {PLAYER_TYPES} from "@/constants";

class PlayerOptionsManager {
  private static readonly OPTIONS_SELECTOR = ".block-with-player .b-options-floated";
  private static readonly ANILIBRIA_BUTTON_SELECTOR = ".anilibria-button";

  async createOptions(
    nameOfAnime: string,
    animeId: number,
    showAniLibria: boolean,
  ): Promise<HTMLDivElement> {
    const options: HTMLDivElement = DomHelper.createElement<HTMLDivElement>(
      "div",
      {
        className: "b-options-floated mobile-phone"
      }
    );

    const buttonTypes: string[] = Object.keys(buttonFactory.getButtonTypes());

    buttonTypes.forEach(type => {
      if (type === PLAYER_TYPES.ANILIBRIA && !showAniLibria) {
        return;
      }

      const button: HTMLAnchorElement = buttonFactory.createButton(
        type,
        {nameOfAnime, animeId}
      );
      options.appendChild(button);
    });

    return options;
  }

  public addAniLibriaOption(
    nameOfAnime: string,
    animeId: number,
  ): void {
    const options: HTMLElement | null = document
      .querySelector(PlayerOptionsManager.OPTIONS_SELECTOR);

    if (options === null) return;

    if (options.querySelector(PlayerOptionsManager.ANILIBRIA_BUTTON_SELECTOR)) {
      return;
    }

    const button: HTMLAnchorElement = buttonFactory.createButton(
      PLAYER_TYPES.ANILIBRIA,
      {nameOfAnime, animeId},
    );
    options.appendChild(button);
  }
}

export default PlayerOptionsManager;
