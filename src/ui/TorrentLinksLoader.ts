import ShikimoriService from "../services/ShikimoriService";
import AnilibriaService, {
  type AniLibriaSearchResult,
  type AniLibriaSearchItem,
  type AniLibriaTorrentResult,
  type AniLibriaTorrentItem,
} from "../services/playerProviderServices/AnilibriaService";
import DomHelper from "../helpers/DomHelper";
import I18nHelper from "../helpers/I18nHelper";
import { BaseLoader } from "@/ui/BaseLoader";
import { PLAYER_CLASSES, SERVICE_URLS } from "@/constants";
import AnilibriaLookupService from "@/services/playerProviderServices/AnilibriaLookupService";

interface LinkResult {
  href: string;
  text: string;
  siteSlug?: string;
}

interface LinkConfig {
  name: string;
  generator: (
    animeName: string,
    anilibriaService?: AnilibriaService
  ) => Promise<LinkResult[] | null>;
  keepPlaceholder?: boolean;
}

const injectedStyles = new Set<string>();

const ICON_MAP: Record<string, string> = {
  rutracker: "assets/torrent-icons/rutracker-favicon.ico",
  "anilibria-magnet": "assets/torrent-icons/anilibria-magnet-favicon.ico",
  "erai-raws": "assets/torrent-icons/erai-raws-favicon.ico",
};

class TorrentLinksLoader extends BaseLoader {
  private readonly shikimoriService = new ShikimoriService();
  private readonly anilibriaService = new AnilibriaService();

  private readonly linkConfigs: LinkConfig[] = [
    {
      name: "RuTracker",
      generator: async (animeName: string): Promise<LinkResult[]> => [
        {
          href: `${SERVICE_URLS.RUTRACKER_URL}?nm=${animeName}`,
          text: "RuTracker",
          siteSlug: "rutracker",
        },
      ],
    },
    {
      name: "AniLibria-magnet",
      keepPlaceholder: true,
      generator: async (
        animeName: string,
        anilibriaService?: AnilibriaService
      ): Promise<LinkResult[] | null> => {
        if (!anilibriaService) return null;
        return this.generateAniLibriaMagnets(animeName, anilibriaService);
      },
    },
    {
      name: "Erai-raws",
      generator: async (animeName: string): Promise<LinkResult[]> => [
        {
          href: `${SERVICE_URLS.ERAI_RAWS}/?s=${animeName}`,
          text: "Erai-raws",
          siteSlug: "erai-raws",
        },
      ],
    },
  ];

  protected async runOnViewChange(): Promise<void> {
    const animeId = this.shikimoriService.getAnimeId(window.location.pathname);
    if (animeId === null) return;

    const animeTitle = await this.shikimoriService.getAnimeName(animeId);
    if (animeTitle === null) return;

    this.removeOldLinks();

    let lastInserted = this.findInsertionPoint() ?? document.body;

    for (const config of this.linkConfigs) {
      lastInserted = await this.processConfig(config, animeTitle, lastInserted);
    }
  }

  private async processConfig(
    config: LinkConfig,
    animeName: string,
    lastInserted: Element
  ): Promise<Element> {
    const siteSlug = config.name.toLowerCase();

    const placeholder = this.createHtmlLinkBlock(
      siteSlug,
      `${I18nHelper.t("loading")}...`
    );

    DomHelper.insertAfter(placeholder, lastInserted);
    lastInserted = placeholder;

    try {
      const results = await config.generator(animeName, this.anilibriaService);

      if (!results || results.length === 0) {
        if (config.keepPlaceholder) {
          placeholder.innerHTML = "";
          return lastInserted;
        }

        placeholder.remove();
        return lastInserted;
      }

      placeholder.innerHTML = "";

      for (const result of results) {
        const slug = (result.siteSlug ?? siteSlug).toLowerCase();

        const block = this.createHtmlLinkBlock(slug);
        const link = this.createHtmlLink(result.text, result.href, slug);

        block.innerHTML = "";
        block.appendChild(link);

        DomHelper.insertAfter(block, lastInserted);
        lastInserted = block;
      }
    } catch {
      const span = placeholder.querySelector("span");
      if (span) {
        span.textContent = `${config.name} (${I18nHelper.t("error")})`;
      }
    }

    return lastInserted;
  }

  private async generateAniLibriaMagnets(
    animeName: string,
    service: AnilibriaService
  ): Promise<LinkResult[] | null> {
    const lookup: AnilibriaLookupService = AnilibriaLookupService.getInstance();
    const searchResults: AniLibriaSearchResult | null =
      await lookup.getOrFetch(animeName);

    if (!searchResults?.length) return null;

    const release: AniLibriaSearchItem | undefined = searchResults[0];
    if (!release) return null;

    const torrents: AniLibriaTorrentResult | null = await service.getTorrentsByReleaseId(release.id);
    if (!torrents?.length) return null;

    const sorted = [...torrents].sort(
      (
        a: AniLibriaTorrentItem,
        b: AniLibriaTorrentItem
      ): number => (b.seeders ?? 0) - (a.seeders ?? 0)
    );

    const episodeRanges = this.extractEpisodeRanges(sorted);

    const firstRange = episodeRanges[0];
    const areRangesEqual = episodeRanges.every((range) => range === firstRange);

    const differingFieldName = areRangesEqual
      ? this.findDifferingField(sorted)
      : null;

    return sorted
      .filter((t) => t.magnet !== "")
      .map((t): LinkResult => {
        let displayText = `AniLibria-magnet ${this.extractEpisodeRange(t)}`;

        if (areRangesEqual && differingFieldName) {
          const extraText = this.getDifferingFieldValue(
            t,
            differingFieldName
          );

          if (extraText) {
            displayText = `${displayText} ${extraText}`;
          }
        }

        return {
          href: t.magnet,
          text: displayText,
          siteSlug: "anilibria-magnet",
        };
      });
  }

  private extractEpisodeRanges(torrentsList: AniLibriaTorrentResult): string[] {
    return torrentsList
      .map((torrentItem: AniLibriaTorrentItem): string =>
        this.extractEpisodeRange(torrentItem)
      )
      .filter(Boolean);
  }

  private findDifferingField(torrentsList: AniLibriaTorrentResult): string | null {
    type FieldGetter = (torrent: AniLibriaTorrentItem) => string | null;

    const fieldGetters: [string, FieldGetter][] = [
      [
        "quality",
        (torrentItem: AniLibriaTorrentItem): string | null => {
          if (
            torrentItem.quality &&
            typeof torrentItem.quality === "object" &&
            typeof torrentItem.quality.value === "string" &&
            torrentItem.quality.value !== ""
          ) {
            return torrentItem.quality.value;
          }

          return null;
        },
      ],
      [
        "codec",
        (torrentItem: AniLibriaTorrentItem): string | null => {
          if (
            torrentItem.codec &&
            typeof torrentItem.codec === "object" &&
            typeof torrentItem.codec.label === "string" &&
            torrentItem.codec.label !== ""
          ) {
            return torrentItem.codec.label;
          }

          return null;
        },
      ],
      [
        "size",
        (torrentItem: AniLibriaTorrentItem): string | null =>
          typeof torrentItem.size === "number"
            ? this.formatSize(torrentItem.size)
            : null,
      ],
      [
        "seeders",
        (torrentItem: AniLibriaTorrentItem): string | null =>
          typeof torrentItem.seeders === "number"
            ? String(torrentItem.seeders)
            : null,
      ],
    ];

    for (const [fieldName, getterFn] of fieldGetters) {
      const valuesSet: Set<string> = new Set<string>(
        torrentsList
          .map(getterFn)
          .filter((valueCandidate): valueCandidate is string =>
            valueCandidate !== null &&
            valueCandidate !== undefined &&
            valueCandidate !== ""
          )
      );

      if (valuesSet.size > 1) {
        return fieldName;
      }
    }

    return null;
  }

  private getDifferingFieldValue(
    torrentItem: AniLibriaTorrentItem,
    fieldName: string
  ): string | null {
    if (fieldName === "quality") {
      if (
        torrentItem.quality &&
        typeof torrentItem.quality === "object" &&
        typeof torrentItem.quality.value === "string"
      ) {
        return torrentItem.quality.value;
      }

      return null;
    }

    if (fieldName === "codec") {
      if (
        torrentItem.codec &&
        typeof torrentItem.codec === "object" &&
        typeof torrentItem.codec.label === "string"
      ) {
        return torrentItem.codec.label;
      }

      return null;
    }

    if (fieldName === "size") {
      if (typeof torrentItem.size === "number") {
        return this.formatSize(torrentItem.size);
      }

      return null;
    }

    if (fieldName === "seeders") {
      if (typeof torrentItem.seeders === "number") {
        return String(torrentItem.seeders);
      }

      return null;
    }

    return null;
  }

  private extractEpisodeRange(torrentItem: AniLibriaTorrentItem): string {
    if (
      typeof torrentItem.label === "string" &&
      torrentItem.label.trim() !== ""
    ) {
      const labelString: string = torrentItem.label.trim();

      const bracketRegex: RegExp = /\[([^\]]+)]/g;
      const matchesList: string[] = [];
      let matchResult: RegExpExecArray | null = null;

      while ((matchResult = bracketRegex.exec(labelString)) !== null) {
        if (matchResult[1]) {
          matchesList.push(matchResult[1].trim());
        }
      }

      for (let indexIterator: number = matchesList.length - 1;
           indexIterator >= 0;
           indexIterator -= 1) {
        const candidateText: string | undefined = matchesList[indexIterator];

        if (candidateText && /[0-9]/.test(candidateText)) {
          return candidateText;
        }
      }

      if (matchesList.length > 0) {
        return matchesList[matchesList.length - 1]!;
      }

      return labelString;
    }

    return String(torrentItem.id);
  }

  private formatSize(bytesValue: number): string {
    if (bytesValue < 1024) {
      return `${bytesValue} B`;
    }

    const kilobytesValue: number = bytesValue / 1024;

    if (kilobytesValue < 1024) {
      return `${Math.round(kilobytesValue)} KB`;
    }

    const megabytesValue: number = kilobytesValue / 1024;

    if (megabytesValue < 1024) {
      return `${Math.round(megabytesValue)} MB`;
    }

    const gigabytesValue: number = megabytesValue / 1024;

    return `${Math.round(gigabytesValue)} GB`;
  }

  private removeOldLinks(): void {
    document.querySelectorAll(".torrent-link").forEach((el) => el.remove());
  }

  private findInsertionPoint(): Element | null {
    const headlines = document.querySelectorAll(".subheadline");
    const target = I18nHelper.t("on_other_sites");

    for (const el of Array.from(headlines)) {
      if (el.textContent?.includes(target)) {
        return el;
      }
    }

    const fallbacks = [
      PLAYER_CLASSES.INFO_RIGHT_COLUMN,
      PLAYER_CLASSES.PLAYER_BLOCK,
      ".b-info-right",
      ".c-sidebar",
    ];

    for (const selector of fallbacks) {
      const found = document.querySelector(selector);
      if (found) return found;
    }

    return null;
  }

  private createHtmlLink(
    text: string,
    href: string,
    siteSlug?: string
  ): HTMLAnchorElement {
    const a = DomHelper.createElement<HTMLAnchorElement>("a", {
      className: "b-link torrent-site-link",
      textContent: text,
    });

    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    this.injectFaviconStyle(siteSlug ?? text.toLowerCase());

    return a;
  }

  private createHtmlLinkBlock(
    siteSlug: string,
    placeholderText = ""
  ): HTMLDivElement {
    const div = DomHelper.createElement<HTMLDivElement>("div", {
      className: `b-external_link ${siteSlug} b-menu-line torrent-link`,
    });

    if (placeholderText) {
      const span = DomHelper.createElement<HTMLSpanElement>("span", {
        className: "b-link torrent-site-link",
        textContent: placeholderText,
      });
      div.appendChild(span);
    }

    this.injectFaviconStyle(siteSlug);

    return div;
  }

  private injectFaviconStyle(siteName: string): void {
    if (injectedStyles.has(siteName)) return;

    const iconPath = ICON_MAP[siteName];
    if (!iconPath) return;

    const publicPath = globalThis.__webpack_public_path__ ?? "";
    const basePath = publicPath.endsWith("/")
      ? publicPath
      : `${publicPath}/`;

    const style = DomHelper.createElement<HTMLStyleElement>("style", {
      textContent: `
      .b-external_link.${siteName} a::before,
      .b-external_link.${siteName} span::before {
        content: '';
        display: inline-block;
        width: 19px;
        height: 19px;
        margin-right: 6px;
        background-size: contain;
        background-image: url('${basePath}${iconPath}');
      }
    `,
    });

    document.head.appendChild(style);
    injectedStyles.add(siteName);
  }
}

export default TorrentLinksLoader;
