"use strict"

class Player {
  static {
    console.debug("player loading...");

    document.addEventListener("turbolinks:load", () => this.#onViewChanged());
  }

  static playerAdded = false;
  static lang = "rus";

  static async #onViewChanged() {
    const match = Shikimori.isAnimePage(window.location);
    if (match) {
      this.playerAdded = false;
      if (document.querySelectorAll(".subheadline")[0].textContent.includes("Information")) {
        this.lang = "eng"
      }

      const animeId = match.groups.id;

      const episode = Shikimori.getWatchingEpisode(animeId);

      const player = this.#createPlayer();
      player.animeId = animeId;
      player.src = `//kodik.cc/find-player?shikimoriID=${player.animeId}` +
                                        `&episode=${episode}`;

      const button = this.#createOpenButton(player);

      const beforeForButton = document.querySelector(".c-info-right .block:last-child");

      Helpers.insertAfter(button, beforeForButton);
    }
  }

  static #createOpenButton(player) {
    const button = document.createElement("div");
    button.className = "watch-online";

    const line = document.createElement("div");
    line.className = "line";

    const kind = document.createElement("div");
    kind.className = "kind";
    kind.appendChild(document.createTextNode("Kodik"));

    const openPlayer = document.createElement("a");
    openPlayer.className = "b-link_button dark";

    if (this.lang == "eng") {
      openPlayer.appendChild(document.createTextNode("Open Player"));
    }
    else {
      openPlayer.appendChild(document.createTextNode("Открыть Плеер"));
    }

    const style = document.createElement("style");
    style.textContent = ".p-animes-show .c-info-right .watch-online .b-link_button::after, .p-mangas-show .c-info-right .watch-online .b-link_button::after, .p-ranobe-show .c-info-right .watch-online .b-link_button::after { content: '▶' }";
    document.head.appendChild(style);

    openPlayer.onclick = () => {
      if (!this.playerAdded) {
        const options = this.#createOptions(player);

        const headline = this.#createHeadline();
  
        const block = this.#createBlock(options, headline, player);
  
        const beforeForPlayer = document.getElementsByClassName("b-db_entry")[0];
  
        Helpers.insertAfter(block, beforeForPlayer);

        if (this.lang == "eng") {
          openPlayer.innerText = "Close Player";
        }
        else {
          openPlayer.innerText = "Закрыть Плеер";
        }

        this.playerAdded = true;
      }
      else if (this.playerAdded) {
        document.querySelector(".block-with-player").remove();

        if (this.lang == "eng") {
          openPlayer.innerText = "Open Player";
        }
        else {
          openPlayer.innerText = "Открыть Плеер";
        }

        this.playerAdded = false;
      }
    }

    line.appendChild(openPlayer);
    button.appendChild(line);
    button.appendChild(kind);

    return button;
  }
  
  static #createOptions(player) {
    const options = document.createElement("div");
    options.className = "b-options-floated mobile-phone";

    const kodik = document.createElement("a");
    kodik.text = "Kodik";
    kodik.onclick = () => player.src =
      `//kodik.cc/find-player?shikimoriID=${player.animeId}` +
                            `&episode=${Shikimori.getWatchingEpisode(player.animeId)}`;
    options.appendChild(kodik);

    return options;
  }

  static #createHeadline() {
    const headline = document.createElement("div");
    headline.className = "subheadline";
    if (this.lang == "eng") {
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

  static #createBlock(options, headline, player) {
    const block = document.createElement("div");
    block.className = "block block-with-player";

    block.appendChild(options);

    block.appendChild(headline);

    block.appendChild(player);

    return block;
  }
}
