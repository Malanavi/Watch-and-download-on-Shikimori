import DomHelper from "@/helpers/DomHelper";

class PlayerStyleManager {
  setShowButtonActiveStyle(): void {
    this.updateStyle(
      `.p-animes-show .c-info-right .watch-online .b-link_button::after,
       .p-mangas-show .c-info-right .watch-online .b-link_button::after,
       .p-ranobe-show .c-info-right .watch-online .b-link_button::after {
         content: '✖';
       }`
    );
  }

  setShowButtonInactiveStyle(): void {
    this.updateStyle(
      `.p-animes-show .c-info-right .watch-online .b-link_button::after,
       .p-mangas-show .c-info-right .watch-online .b-link_button::after,
       .p-ranobe-show .c-info-right .watch-online .b-link_button::after {
         content: '▶';
       }`
    );
  }

  private updateStyle(cssContent: string): void {
    const style = document
      .querySelector('style#player-style') as HTMLStyleElement | null;

    if (style !== null) {
      style.textContent = cssContent;
      return;
    }

    const newStyle: HTMLStyleElement = DomHelper.createElement<HTMLStyleElement>(
      "style",
      {
        textContent: cssContent,
      }
    );
    newStyle.id = "player-style";
    document.head.appendChild(newStyle);
  }
}

export default PlayerStyleManager;
