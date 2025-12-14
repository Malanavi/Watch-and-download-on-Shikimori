import PageObserver from "@/services/PageObserver";
import ShowPlayerButtonLoader from "./ui/ShowPlayerButtonLoader";
import TorrentLinksLoader from "./ui/TorrentLinksLoader";
import "./ui/buttons/playerSelectionButtons/initButtons";
import "./ui/players/initPlayers";

PageObserver.getInstance({ debounceMs: 200, enableMutationObserver: true });
new ShowPlayerButtonLoader();
new TorrentLinksLoader();
