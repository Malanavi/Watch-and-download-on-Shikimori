import I18nHelper from "../../helpers/I18nHelper";
import DomHelper from "@/helpers/DomHelper";

class PlayerHeadlineManager {
  createHeadline(): HTMLDivElement {
    const headline: HTMLDivElement = DomHelper.createElement<HTMLDivElement>(
      "div",
      {
        className: "subheadline",
      }
    );
    headline.textContent = I18nHelper.t("watch");

    return headline;
  }
}

export default PlayerHeadlineManager;
