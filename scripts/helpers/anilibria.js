"use strict"

class AniLibria {

    static async getAnimeOnAnilibria(url) {
        const headers = {
            'Content-Type': 'application/json'
        }

        const response = await fetch(url, {
            headers: headers
        });
        if (response.ok) {
            return response.json();
        }
        const error = await response.json();
        const e = new Error('Что-то пошло не так');
        e.data = error;
        throw e;
    }

    static createAnilibriaButton(nameOfAnime) {

        const anilibria = document.createElement("a");
        anilibria.text = "AniLibria";
        anilibria.onclick = () => {
            this.#removePlayer(".iframe-player");

            const searchUrl = `https://api.anilibria.tv/v3/title/search?search=${nameOfAnime}`;
            AniLibria.getAnimeOnAnilibria(searchUrl)
                .then(data => {
                    let anilibriaId = (data.list[0].id)
                    const block = document.querySelector(".block-with-player");
                    block.appendChild(this.#createAnilibriaPlayer(anilibriaId));
                })
                .catch(err => console.debug(err));
        }

        return anilibria;
    }

    static #createAnilibriaPlayer(anilibriaId) {
        const anilibriaPlayer = document.createElement("iframe");
        anilibriaPlayer.width = "100%";
        anilibriaPlayer.scrolling = "no";
        anilibriaPlayer.allowFullscreen = true;
        anilibriaPlayer.frameborder = "0";
        anilibriaPlayer.src = `https://tb2s5.anilib.top/public/iframe.php?id=${anilibriaId}`;
        anilibriaPlayer.className = "iframe-player";

        new ResizeObserver(() => {
            anilibriaPlayer.height = 9 * anilibriaPlayer.clientWidth / 16;
        }).observe(anilibriaPlayer);

        return anilibriaPlayer;
    }

    static #removePlayer(className) {
        const player = document.querySelector(className);
        if (player) {
            player.remove();
        }
    }
}
