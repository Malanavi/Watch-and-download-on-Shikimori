import PageObserver from "@/services/PageObserver";
import ShowPlayerButtonLoader from "../../ui/ShowPlayerButtonLoader";
import TorrentLinksLoader from "../../ui/TorrentLinksLoader";
import "../../ui/buttons/playerSelectionButtons/initButtons";
import "../../ui/players/initPlayers";

const w = window as any;

if (!w.__SHIKIMORI_EXTENSION_LOADED__) {
    w.__SHIKIMORI_EXTENSION_LOADED__ = true;

    PageObserver.getInstance({ debounceMs: 200, enableMutationObserver: true });
    new ShowPlayerButtonLoader();
    new TorrentLinksLoader();
}