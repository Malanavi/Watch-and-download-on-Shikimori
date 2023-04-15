"use strict"

class Shikimori {
  static isAnimePage(location) {
    const isAnimePageRegEx = /\/animes\/[a-z]?(?<id>[0-9]+)-([a-z0-9]+-?)+$/;

    return location.pathname.match(isAnimePageRegEx);
  }

  static getWatchingEpisode(animeId) {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      `${window.location.protocol}//${window.location.hostname}/api/animes/${animeId}`,
      false);

    request.send();
    const response = JSON.parse(request.response);

    return (response.user_rate?.episodes || 0) + 1;
  }

  static getNameOfAnime(animeId) {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      `${window.location.protocol}//${window.location.hostname}/api/animes/${animeId}`,
      false);

    request.send();
    const response = JSON.parse(request.response);

    return (response.name || response.english[0] || response.russian || 0);
  }
}
