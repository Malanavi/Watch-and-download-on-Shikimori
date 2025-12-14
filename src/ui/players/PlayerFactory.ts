import AbstractPlayer from "./AbstractPlayer";
import {PLAYER_TYPES} from "@/constants";

type PlayerType = typeof PLAYER_TYPES[keyof typeof PLAYER_TYPES];

type PlayerCreator<T extends AbstractPlayer = AbstractPlayer> = (animeId: number) => T;

class PlayerFactory {
  private playerTypes: Partial<Record<PlayerType, PlayerCreator>> = {};

  registerPlayer<T extends AbstractPlayer>(
    type: PlayerType,
    creator: PlayerCreator<T>
  ): void {
    this.playerTypes[type] = creator;
  }

  createPlayer<T extends AbstractPlayer>(
    type: PlayerType,
    animeId: number
  ): T {
    const creator: PlayerCreator | undefined = this.playerTypes[type];

    if (creator === undefined) {
      throw new Error(`Unknown player type: ${type}`);
    }

    return creator(animeId) as T;
  }
}

const playerFactory = new PlayerFactory();
export default playerFactory;
