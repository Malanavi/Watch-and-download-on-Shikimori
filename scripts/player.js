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
      if (document.querySelector(".open-player-button")) {
        document.querySelector(".open-player-button").remove();
      }
      if (document.querySelector(".block-with-player")) {
        document.querySelector(".block-with-player").remove();
      }

      this.playerAdded = false;

      if (document.querySelectorAll(".subheadline")[0].textContent.includes("Information")) {
        this.lang = "eng"
      }

      const animeId = match.groups.id;

      const nameOfAnime = Shikimori.getNameOfAnime(animeId);

      const button = this.#createOpenButton(nameOfAnime, animeId);

      const beforeForButton = document.querySelector(".c-info-right .block:last-child");

      Helpers.insertAfter(button, beforeForButton);
    }
  }

  static #createOpenButton(nameOfAnime, animeId) {
    const button = document.createElement("div");
    button.className = "watch-online open-player-button";

    const line = document.createElement("div");
    line.className = "line";

    const kind = document.createElement("div");
    kind.className = "kind";
    kind.appendChild(document.createTextNode("Kodik / AniLibria"));

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
        const options = this.#createOptions(nameOfAnime, animeId);

        const headline = this.#createHeadline();

        const block = this.#createBlock(options, headline, animeId);

        const beforeForPlayer = document.getElementsByClassName("b-db_entry")[0];

        Helpers.insertAfter(block, beforeForPlayer);

        if (this.lang == "eng") {
          openPlayer.innerText = "Close Player";
        }
        else {
          openPlayer.innerText = "Закрыть Плеер";
        }

        style.textContent = ".p-animes-show .c-info-right .watch-online .b-link_button::after, .p-mangas-show .c-info-right .watch-online .b-link_button::after, .p-ranobe-show .c-info-right .watch-online .b-link_button::after { content: '✖' }";

        Kodik.precreateKodikPlayer(animeId);

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

        style.textContent = ".p-animes-show .c-info-right .watch-online .b-link_button::after, .p-mangas-show .c-info-right .watch-online .b-link_button::after, .p-ranobe-show .c-info-right .watch-online .b-link_button::after { content: '▶' }";

        this.playerAdded = false;
      }
    }

    line.appendChild(openPlayer);
    button.appendChild(line);
    button.appendChild(kind);

    return button;
  }

  static #createOptions(nameOfAnime = null, animeId = null) {
    const options = document.createElement("div");
    options.className = "b-options-floated mobile-phone";

    options.appendChild(Kodik.createKodikButton(animeId));
    options.appendChild(AniLibria.createAnilibriaButton(nameOfAnime));

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

  static #createBlock(options, headline, animeId) {
    const block = document.createElement("div");
    block.className = "block block-with-player";

    block.appendChild(options);

    block.appendChild(headline);

    return block;
  }
}
