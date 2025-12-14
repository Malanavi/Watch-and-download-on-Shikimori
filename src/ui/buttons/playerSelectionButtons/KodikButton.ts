import playerFactory from "../../players/PlayerFactory";
import {PLAYER_TYPES} from "@/constants";
import type AbstractPlayer from "../../players/AbstractPlayer";
import DomHelper from "../../../helpers/DomHelper";

interface ButtonParams {
  animeId: number;
  nameOfAnime: string;
}

class KodikButton {
  create(params: ButtonParams): HTMLAnchorElement {
    const button: HTMLAnchorElement = DomHelper.createElement<HTMLAnchorElement>(
      "a",
      {
        className: "kodik-button",
        textContent: PLAYER_TYPES.KODIK,
      }
    );

    button.addEventListener(
      "click",
      async (event: MouseEvent): Promise<void> => {
        event.preventDefault();

        document
          .querySelectorAll(".iframe-player")
          .forEach((player: Element) => player.remove());

        const player: AbstractPlayer = playerFactory.createPlayer(
          PLAYER_TYPES.KODIK,
          params.animeId
        );
        const block = document
          .querySelector<HTMLElement>(".block-with-player");

        if (block === null) {
          return;
        }

        await player.appendPlayerToBlock(block);
      });

    return button;
  }
}

export default KodikButton;
