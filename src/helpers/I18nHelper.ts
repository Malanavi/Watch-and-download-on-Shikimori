import {LANGUAGES} from "@/constants";
import en from "../i18n/en.json"
import ru from "../i18n/ru.json"

interface TranslationObject {
  [key: string]: string;
}

const TRANSLATIONS: Record<string, TranslationObject> = {
  [LANGUAGES.ENGLISH]: en,
  [LANGUAGES.RUSSIAN]: ru
};

class I18nHelper {
  private static cachedLanguage: string | null = null;

  /**
   * Determines current page language.
   *
   * @returns {"eng" | "rus"}
   */
  static getLanguage(): string {
    if (I18nHelper.cachedLanguage !== null) {
      return I18nHelper.cachedLanguage;
    }

    const someBlock: Element | null = document
      .querySelector(".b-db_entry .c-info-left .subheadline");
    const isEnglish: boolean = someBlock !== null
      && someBlock.textContent?.includes("Information") === true;

    I18nHelper.cachedLanguage = isEnglish ? LANGUAGES.ENGLISH : LANGUAGES.RUSSIAN;
    return I18nHelper.cachedLanguage;
  }

  static resetCache(): void {
    I18nHelper.cachedLanguage = null;
  }

  /**
   * Returns translation by key.
   * Falls back to the key itself if translation is missing.
   *
   * @param {string} key — ключ в формате snake_case
   * @returns {string} перевод на текущем языке
   */
  static t(key: string): string {
    const lang: string = I18nHelper.getLanguage();
    const translation: string | undefined = TRANSLATIONS[lang]?.[key];

    return translation ?? key;
  }
}

export default I18nHelper;
