"use strict"

class Torrent {
  static {
    console.debug("torrent link loading...");

    document.addEventListener("turbolinks:load", () => this.#onViewChanged());
  }

  static async #onViewChanged() {
    const match = Shikimori.isAnimePage(window.location);
    if (match) {
      if (document.querySelector(".rutracker-link")) {
        document.querySelector(".rutracker-link").remove();
      }

      const animeId = match.groups.id;

      const nameOfAnime = Shikimori.getNameOfAnime(animeId);

      const torrent = this.#createTorrent();
      torrent.animeId = animeId;
      torrent.src = `https://rutracker.org/forum/tracker.php?nm=${nameOfAnime}`;

      const link = this.#createLink(torrent);

      const block = this.#createBlock(link, torrent);

      const elements = document.querySelectorAll(".subheadline");
      var arr = [];

      for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent.includes("on other sites") || elements[i].textContent.includes("На других сайтах")) {
          arr.push(elements[i]);
        }
      }
      const before = arr[0];

      Helpers.insertAfter(block, before);
    }
  }

  static #createLink(torrent) {
    const link = document.createElement("a");
    link.className = "b-link";
    link.text = "RuTracker";

    const style = document.createElement("style");
    style.textContent = ".b-external_link.rutracker .linkeable::before, .b-external_link.rutracker .none::before, .b-external_link.rutracker a::before, .b-external_link.rutracker span::before { content: ''; height: 19px; margin-right: 6px; width: 19px; background-size: 19px 19px; background-color: rgba(0, 0, 0, 0); background-image: url('https://raw.github.com/Malanavi/Watch-and-download-on-Shikimori/main/images/icons/rutracker-favicon.ico'); }";
    document.head.appendChild(style);

    link.href = `${torrent.src}`;
    link.target = `_blank`;

    return link;
  }

  static #createTorrent() {
    const torrent = document.createElement("div");

    return torrent;
  }

  static #createBlock(link) {
    const block = document.createElement("div");
    block.className = "b-external_link rutracker b-menu-line rutracker-link";

    block.appendChild(link);

    return block;
  }
}
