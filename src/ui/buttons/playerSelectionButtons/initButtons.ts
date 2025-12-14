import buttonFactory from './ButtonFactory';
import KodikButton from './KodikButton';
import AnilibriaButton from './AnilibriaButton';
import {PLAYER_TYPES} from "@/constants";

interface ButtonParams {
  animeId: number;
  nameOfAnime: string;
}

buttonFactory.registerButton(
  PLAYER_TYPES.KODIK,
  (params: ButtonParams): HTMLAnchorElement => new KodikButton().create(params)
);
buttonFactory.registerButton(
  PLAYER_TYPES.ANILIBRIA,
  (params: ButtonParams): HTMLAnchorElement => new AnilibriaButton().create(params)
);
