"use strict"

class Player {
  static {
    console.debug("player loading...");

    document.addEventListener("turbolinks:load", () => this.#onViewChanged());
  }

  static playerAdded = false;

  static async #onViewChanged() {
    const match = Shikimori.isAnimePage(window.location);
    if (match) {
      this.playerAdded = false;

      const animeId = match.groups.id;

      const episode = Shikimori.getWatchingEpisode(animeId);

      const player = this.#createPlayer();
      player.animeId = animeId;
      player.src = `//kodik.cc/find-player?shikimoriID=${player.animeId}` +
                                        `&episode=${episode}`;

      const options = this.#createOptions(player);

      const headline = this.#createHeadline();

      const block = this.#createBlock(options, headline);

      const before = document.getElementsByClassName("b-db_entry")[0];

      Helpers.insertAfter(block, before);
    }
  }

  static #createOptions(player) {
    const options = document.createElement("div");
    options.className = "b-options-floated mobile-phone";

    const kodik = document.createElement("a");
    kodik.text = "Kodik";
    kodik.addEventListener("click", () => {
      if (!this.playerAdded) {
        document.getElementById("player-container").appendChild(player);
        this.playerAdded = true;
      }
    });
    options.appendChild(kodik);

    return options;
  }

  static #createHeadline() {
    const headline = document.createElement("div");
    headline.className = "subheadline";
    if (document.querySelectorAll(".subheadline")[0].textContent.includes("Information")) {
      headline.appendChild(document.createTextNode("watch"));
    }
    else {
      headline.appendChild(document.createTextNode("смотреть"));
    }

    return headline;
  }

  static #createPlayer() {
    const player = document.createElement("iframe");
    player.width = "100%";
    player.scrolling = "no";
    player.allowFullscreen = true;
    player.id = "player-iframe";

    new ResizeObserver(() => {
      player.height = 9 * player.clientWidth / 16; // Calculate to fit 16:9
    }).observe(player);

    return player;
  }

  static #createBlock(options, headline) {
    const block = document.createElement("div");
    block.className = "block";

    block.appendChild(options);

    block.appendChild(headline);

    const playerContainer = document.createElement("div");
    playerContainer.id = "player-container";
    block.appendChild(playerContainer);

    return block;
  }
}
