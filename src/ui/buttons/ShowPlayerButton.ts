import PlayerService from "@/services/playerServices/PlayerService";
import {PLAYER_CLASSES} from "@/constants";
import I18nHelper from "@/helpers/I18nHelper";
import DomHelper from "@/helpers/DomHelper";

interface ShowPlayerButtonConfig {
  readonly animeName: string;
  readonly animeId: number;
  showAniLibria: boolean;
}

interface ShowPlayerButtonState {
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
  private static readonly states = new WeakMap<
    HTMLDivElement,
    ShowPlayerButtonState
  >();

  public static createShowButton(
    config: ShowPlayerButtonConfig,
  ): HTMLDivElement {
    const root = ShowPlayerButton.createRootButton();
    const state: ShowPlayerButtonState = {
      showAniLibria: config.showAniLibria,
    };
    const link = ShowPlayerButton.createLinkButton(config, state);
    const kind = ShowPlayerButton.createKindElement(config.showAniLibria);
    const line = ShowPlayerButton.createLineElement(link);

    root.appendChild(line);
    root.appendChild(kind);

    ShowPlayerButton.states.set(root, state);
    ShowPlayerButton.appendToContainer(root);

    return root;
  }

  public static setAniLibriaAvailable(
    button: HTMLDivElement,
    showAniLibria: boolean,
  ): void {
    const state = ShowPlayerButton.states.get(button);
    if (state) {
      state.showAniLibria = showAniLibria;
    }

    const kind = button.querySelector<HTMLDivElement>(
      `.${ShowPlayerButton.BUTTON_CLASSES.KIND}`,
    );
    if (kind === null) return;

    kind.textContent = ShowPlayerButton.getKindText(showAniLibria);
  }

  private static createRootButton(): HTMLDivElement {
    return DomHelper.createElement("div", {
      className: ShowPlayerButton.BUTTON_CLASSES.ROOT,
    });
  }

  private static createLinkButton(
    config: ShowPlayerButtonConfig,
    state: ShowPlayerButtonState,
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
        state.showAniLibria,
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
    return DomHelper.createElement("div", {
      className: ShowPlayerButton.BUTTON_CLASSES.KIND,
      textContent: ShowPlayerButton.getKindText(showAnilibria),
    });
  }

  private static getKindText(showAnilibria: boolean): string {
    return showAnilibria
      ? ShowPlayerButton.KIND_TEXT_KODIK_ANILIBRIA
      : ShowPlayerButton.KIND_TEXT_KODIK;
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
