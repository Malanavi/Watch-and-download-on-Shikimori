interface ButtonParams {
  animeId: number;
  nameOfAnime: string;
}

type ButtonCreator = (params: ButtonParams) => HTMLAnchorElement;

class ButtonFactory {
  private buttonTypes: Record<string, ButtonCreator> = {};

  registerButton(type: string, creator: ButtonCreator): void {
    this.buttonTypes[type] = creator;
  }

  createButton(type: string, params: ButtonParams): HTMLAnchorElement {
    const creator: ButtonCreator | undefined = this.buttonTypes[type];
    if (creator === undefined) {
      throw new Error(`Unknown button type: ${type}`);
    }
    return creator(params);
  }

  getButtonTypes(): Record<string, ButtonCreator> {
    return this.buttonTypes;
  }
}

const buttonFactory = new ButtonFactory();
export default buttonFactory;
