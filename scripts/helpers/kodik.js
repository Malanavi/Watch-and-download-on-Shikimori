"use strict"

class Kodik {

    static createKodikButton(animeId) {

        const kodik = document.createElement("a");
        kodik.text = "Kodik";
        kodik.onclick = () => {
            this.#removePlayer(".iframe-player");

            const block = document.querySelector(".block-with-player");
            block.appendChild(this.#createKodikPlayer(animeId));
        }

        return kodik;
    }

    static precreateKodikPlayer(animeId) {
        const block = document.querySelector(".block-with-player");
        block.appendChild(this.#createKodikPlayer(animeId));
    }

    static #createKodikPlayer(animeId) {
        const kodikPlayer = document.createElement("iframe");
        kodikPlayer.width = "100%";
        kodikPlayer.scrolling = "no";
        kodikPlayer.allowFullscreen = true;
        kodikPlayer.src =
            `//kodik.cc/find-player?shikimoriID=${animeId}` + `&episode=${Shikimori.getWatchingEpisode(animeId)}`;
        kodikPlayer.className = "iframe-player";

        new ResizeObserver(() => {
            kodikPlayer.height = 9 * kodikPlayer.clientWidth / 16; // Calculate to fit 16:9
        }).observe(kodikPlayer);

        return kodikPlayer;
    }

    static #removePlayer(className) {
        const player = document.querySelector(className);
        if (player) {
            player.remove();
        }
    }
}
