import DomHelper from "../../helpers/DomHelper";

abstract class AbstractPlayer<T extends Element = HTMLIFrameElement> {
  protected animeId: number;
  protected playerElement: T | null = null;

  protected constructor(animeId: number) {
    this.animeId = animeId;
  }

  protected abstract createPlayer(): Promise<T>;

  protected static createIframe(
    iframeSrc: string,
  ): HTMLIFrameElement {
    const iframe = DomHelper
      .createElement<HTMLIFrameElement>(
        "iframe",
        {className: "iframe-player"},
      );

    iframe.width = "100%";
    iframe.style.overflow = "hidden";
    iframe.allowFullscreen = true;
    iframe.style.border = "none";
    iframe.src = iframeSrc;

    return iframe;
  }

  async appendPlayerToBlock(parentBlock: HTMLElement): Promise<void> {
    if (this.playerElement === null) {
      this.playerElement = await this.createPlayer();
      parentBlock.appendChild(this.playerElement);
    }

    if (!(this.playerElement instanceof HTMLIFrameElement)) {
      return;
    }

    const ratio: number = this.getAspectRatio();

    this.applyAspectRatio(
      parentBlock,
      this.playerElement,
      ratio,
    );
  }

  protected getAspectRatio(): number {
    return 16 / 9;
  }

  private applyAspectRatio(
    container: HTMLElement,
    iframe: HTMLIFrameElement,
    ratio: number,
  ): void {
    const width = container.clientWidth;

    if (width === 0) {
      return;
    }

    iframe.style.height = `${width / ratio}px`;
  }
}

export default AbstractPlayer;
