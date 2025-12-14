class DomHelper {
    static insertAfter(newNode: Element, existingNode: Element): void {
        existingNode
          .parentNode
          ?.insertBefore(
            newNode,
            existingNode.nextSibling
          );
    }

  static setClassName(
    element: HTMLElement,
    className: string
  ): void {
    element.className = className;
  }

  static setTextContent(
    element: HTMLElement,
    text: string
  ): void {
    element.textContent = text;
  }

  static createElement<T extends HTMLElement>(
    tagName: string,
    options: {
      className?: string;
      textContent?: string;
    }
  ): T {
    const element: T = document.createElement(tagName) as T;

    if (options.className !== undefined) {
      DomHelper.setClassName(element, options.className);
    }

    if (options.textContent !== undefined) {
      DomHelper.setTextContent(element, options.textContent);
    }

    return element;
  }
}

export default DomHelper;
