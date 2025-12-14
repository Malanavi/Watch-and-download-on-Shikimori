import buttonFactory from "../../ui/buttons/playerSelectionButtons/ButtonFactory";
import DomHelper from "@/helpers/DomHelper";
import {PLAYER_TYPES} from "@/constants";

class PlayerOptionsManager {
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
}

export default PlayerOptionsManager;
