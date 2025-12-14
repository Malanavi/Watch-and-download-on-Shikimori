import playerFactory from "./PlayerFactory";
import KodikPlayer from "./KodikPlayer";
import AnilibriaPlayer from "./AnilibriaPlayer";
import {PLAYER_TYPES} from "@/constants";

playerFactory.registerPlayer(
  PLAYER_TYPES.KODIK,
  (animeId: number): KodikPlayer => new KodikPlayer(animeId),
);
playerFactory.registerPlayer(
  PLAYER_TYPES.ANILIBRIA,
  (animeId: number): AnilibriaPlayer => new AnilibriaPlayer(animeId),
);
