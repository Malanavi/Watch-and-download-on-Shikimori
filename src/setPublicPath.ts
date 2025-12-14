type ExtensionRuntime = {
  getURL(path: string): string;
};

type ExtensionAPI = {
  runtime?: ExtensionRuntime;
};

const isExtensionApi = (value: unknown): value is ExtensionAPI => {
  return (
    typeof value === "object" &&
    value !== null &&
    "runtime" in value &&
    typeof (value as { runtime?: unknown }).runtime === "object"
  );
};

((): void => {
  const candidates: unknown[] = [];

  if ("browser" in globalThis) {
    candidates.push(
      (globalThis as { browser?: unknown }).browser,
    );
  }

  if ("chrome" in globalThis) {
    candidates.push(
      (globalThis as { chrome?: unknown }).chrome,
    );
  }

  let publicPath = "";

  for (const candidate of candidates) {
    if (
      isExtensionApi(candidate) &&
      typeof candidate.runtime?.getURL === "function"
    ) {
      publicPath = candidate.runtime.getURL("/");
      break;
    }
  }

  (globalThis as {
    __webpack_public_path__?: string;
  }).__webpack_public_path__ = publicPath;
})();
