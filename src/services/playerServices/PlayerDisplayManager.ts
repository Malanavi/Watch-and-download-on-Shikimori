import KodikPlayer from "../../ui/players/KodikPlayer";

class PlayerDisplayManager {
  async addDefaultPlayer(
    animeId: number,
    parentBlock: HTMLElement,
  ): Promise<void> {
    const player = new KodikPlayer(animeId);
    await player.appendPlayerToBlock(parentBlock);
  }

  removePlayerBlock(): void {
    const playerBlock: Element | null = document
      .querySelector(".block-with-player");

    if (playerBlock === null) {
      return;
    }

    playerBlock.remove();
  }

  hasPlayer(): boolean {
    return document
      .querySelector(".block-with-player") !== null;
  }
}

export default PlayerDisplayManager;
