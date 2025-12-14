export const PLAYER_CLASSES = {
  BUTTON: ".show-player-button",
  PLAYER_BLOCK: ".block-with-player",
  INFO_RIGHT_COLUMN: ".c-info-right"
} as const;

export const LANGUAGES = {
  ENGLISH: "eng",
  RUSSIAN: "ru"
} as const;

export const PLAYER_TYPES = {
  KODIK: "Kodik",
  ANILIBRIA: "AniLibria"
} as const;

export const SERVICE_URLS = {
  KODIK_IFRAME_PLAYER_URL: "//kodik.cc/find-player",
  ANILIBRIA_IFRAME_PLAYER_URL: "https://tb2s5.anilib.top/public/iframe.php",
  ANILIBRIA_API_SEARCH_URL: "https://api.anilibria.app/api/v1/app/search/releases",
  RUTRACKER_URL: "https://rutracker.org/forum/tracker.php",
  ANILIBRIA_API_TORRENT_URL: "https://api.anilibria.app/api/v1/anime/torrents/release",
  ERAI_RAWS: "https://www.erai-raws.info",
} as const;
