import DomHelper from "../../helpers/DomHelper";
import PlayerStyleManager from "./PlayerStyleManager";
import PlayerDisplayManager from "./PlayerDisplayManager";
import PlayerHeadlineManager from "./PlayerHeadlineManager";
import PlayerOptionsManager from "./PlayerOptionsManager";
import I18nHelper from "../../helpers/I18nHelper";

class PlayerService {
  private styleManager: PlayerStyleManager;
  private displayManager: PlayerDisplayManager;
  private headlineManager: PlayerHeadlineManager;
  private optionsManager: PlayerOptionsManager;

  constructor() {
    this.styleManager = new PlayerStyleManager();
    this.displayManager = new PlayerDisplayManager();
    this.headlineManager = new PlayerHeadlineManager();
    this.optionsManager = new PlayerOptionsManager();
  }

  async addDefaultPlayer(
    animeName: string,
    animeId: number,
    showAniLibria: boolean,
  ): Promise<void> {
    const parentBlock: HTMLDivElement = await this.preparePlayer(
      animeName,
      animeId,
      showAniLibria,
    );
    await this.displayManager.addDefaultPlayer(animeId, parentBlock);
    this.styleManager.setShowButtonActiveStyle();
  }

  removePlayerBlock(): void {
    this.displayManager.removePlayerBlock();
    this.styleManager.setShowButtonInactiveStyle();
  }

  async togglePlayer(
    showPlayerAnchor: HTMLAnchorElement,
    animeName: string,
    animeId: number,
    showAniLibria: boolean,
  ): Promise<void> {
    if (!this.displayManager.hasPlayer()) {
      await this.addDefaultPlayer(
        animeName,
        animeId,
        showAniLibria,
      );
      showPlayerAnchor.textContent = I18nHelper.t("hide_player");
    } else {
      this.removePlayerBlock();
      showPlayerAnchor.textContent = I18nHelper.t("show_player");
    }
  }

  private async preparePlayer(
    animeName: string,
    animeId: number,
    showAniLibria: boolean,
  ): Promise<HTMLDivElement> {
    const options: HTMLDivElement = await this
      .optionsManager
      .createOptions(
        animeName,
        animeId,
        showAniLibria
      );
    const headline: Element = this.headlineManager.createHeadline();
    const block: HTMLDivElement = DomHelper.createElement<HTMLDivElement>(
      "div",
      {
        className: "block block-with-player",
      }
    );
    block.appendChild(options);
    block.appendChild(headline);

    const beforeForPlayer: Element | null = document
      .querySelector(".b-db_entry");

    if (beforeForPlayer === null) {
      throw new Error("Cannot find .b-db_entry");
    }

    DomHelper.insertAfter(block, beforeForPlayer);

    return block;
  }
}

export default PlayerService;
