import PlayerService from "@/services/playerServices/PlayerService";
import {PLAYER_CLASSES} from "@/constants";
import I18nHelper from "@/helpers/I18nHelper";
import DomHelper from "@/helpers/DomHelper";

interface ShowPlayerButtonConfig {
  readonly animeName: string;
  readonly animeId: number;
  showAniLibria: boolean;
}

class ShowPlayerButton {
  private static readonly BUTTON_CLASSES = {
    ROOT: "watch-online show-player-button",
    LINE: "line",
    LINK: "b-link_button dark",
    KIND: "kind",
  } as const;

  private static readonly KIND_TEXT_KODIK_ANILIBRIA = "Kodik / Anilibria";
  private static readonly KIND_TEXT_KODIK = "Kodik";

  public static createShowButton(
    config: ShowPlayerButtonConfig,
  ): HTMLDivElement {
    const root = ShowPlayerButton.createRootButton();
    const link = ShowPlayerButton.createLinkButton(config);
    const kind = ShowPlayerButton.createKindElement(config.showAniLibria);
    const line = ShowPlayerButton.createLineElement(link);

    root.appendChild(line);
    root.appendChild(kind);

    ShowPlayerButton.appendToContainer(root);

    return root;
  }

  private static createRootButton(): HTMLDivElement {
    return DomHelper.createElement("div", {
      className: ShowPlayerButton.BUTTON_CLASSES.ROOT,
    });
  }

  private static createLinkButton(
    config: ShowPlayerButtonConfig,
  ): HTMLAnchorElement {
    const link = DomHelper.createElement<HTMLAnchorElement>("a", {
      className: ShowPlayerButton.BUTTON_CLASSES.LINK,
      textContent: I18nHelper.t("show_player"),
    });

    link.addEventListener("click", (event: MouseEvent): void => {
      event.preventDefault();
      void ShowPlayerButton.handleLinkClick(
        link,
        config.animeName,
        config.animeId,
        config.showAniLibria,
      );
    });

    return link;
  }

  private static async handleLinkClick(
    link: HTMLAnchorElement,
    animeName: string,
    animeId: number,
    showAniLibria: boolean,
  ): Promise<void> {
    const playerService = new PlayerService();
    await playerService.togglePlayer(
      link,
      animeName,
      animeId,
      showAniLibria,
    );
  }

  private static createKindElement(
    showAnilibria: boolean,
  ): HTMLDivElement {
    const text = showAnilibria
      ? ShowPlayerButton.KIND_TEXT_KODIK_ANILIBRIA
      : ShowPlayerButton.KIND_TEXT_KODIK;

    return DomHelper.createElement("div", {
      className: ShowPlayerButton.BUTTON_CLASSES.KIND,
      textContent: text,
    });
  }

  private static createLineElement(
    link: HTMLAnchorElement,
  ): HTMLDivElement {
    const line = DomHelper.createElement<HTMLDivElement>("div", {
      className: ShowPlayerButton.BUTTON_CLASSES.LINE,
    });

    line.appendChild(link);
    return line;
  }

  private static appendToContainer(button: HTMLDivElement): void {
    const container = document.querySelector(
      PLAYER_CLASSES.INFO_RIGHT_COLUMN,
    );

    if (!container) {
      return;
    }

    container.appendChild(button);
  }
}

export default ShowPlayerButton;
